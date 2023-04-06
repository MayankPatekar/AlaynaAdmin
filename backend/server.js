import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinaryModule from "cloudinary";
const cloudinary = cloudinaryModule.v2;
// import crypto from "crypto";
// import path from "path";

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

mongoose.connect(
  "mongodb+srv://alayna2k23:XLrO7pHUEKiQREmq@cluster0.2ygko3y.mongodb.net/alayna?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const userSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: [true, "Enter First Name."],
    },
    lname: {
      type: String,
      required: [true, "Enter Last Name."],
    },
    email: {
      type: String,
      required: [true, "Enter valid Email."],
    },
    phone: {
      type: String,
      require: [true, "Enter Phone Number"],
    },
    password: {
      type: String,
      required: [true, "Please enter password"],
      // select:false
    },
    points: Number,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    points: Number,
    // orders:[[]],
    // address:[[]],
  },
  { timestamps: true }
);
const User = new mongoose.model("User", userSchema);

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Enter valid Email."],
    },
    password: {
      type: String,
      required: [true, "Please enter password"],
      // select:false
    },
    // orders:[[]],
    // address:[[]],
  },
  { timestamps: true }
);

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
adminSchema.methods.matchPasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};
adminSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, "hcnsjf739dnsjnejwnds934lfgjnkmd0i", {
    // expiresIn: process.env.JWT_EXPIRE,
    expiresIn: "10min",
  });
};

let protect = async (req, res, next) => {
  let token = undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Admin")
  ) {
    console.log(req.headers.authorization);
    let tokenId = req.headers.authorization.split(" ");
    // console.log(token);
    console.log(tokenId);
    token = tokenId[1];
  }

  if (!token) {
    return next(res.status(401).send({ message: "unauthorized access" }));
  }

  try {
    const decoded = jwt.verify(token, "hcnsjf739dnsjnejwnds934lfgjnkmd0i");
    const user = await Admin.findById(decoded.id);
    if (!user) {
      return next(res.status(404).send({ message: "Admin Not Found" }));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(res.status(401).send({ message: "not authorized" }));
  }
};

const Admin = new mongoose.model("Admin", adminSchema);

const productSchema = new mongoose.Schema(
  {
    ProductName: String,
    ProductBrand: String,
    Description: String,
    Category: [String],
    SubCategory: String,
    Types: [
      {
        typeNo: Number,
        unit: String,
        size: Number,
        price: Number,
        quantity: Number,
      },
    ],
    Image: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

// const productSchema = new mongoose.Schema({
//     ProductName: String,
//     ProductBrand:String,
//     Description:String,
//     Category:[String],
//     SubCategory:String,
//     // Size:[String],
//     // Colors:[{
//     //     colorName:String,
//     //     Image:{
//     //         type:Object
//     //     },
//     // }],
//     Variants:[{
//         Size:String,
//         ColorName:String,
//         Image:{
//             type:Object,
//         },
//         Price:Number,
//         Quantity:Number,
//     }]

// },{timestamps:true})

const Product = new mongoose.model("Product", productSchema);

// order schema
const orderSchema = new mongoose.Schema(
  {
    Items: [],
    shippingDetails: [],
    userId: String,
    isDelivered: Boolean,
    isPaid: Boolean,
    isPacked:Boolean,
    isShipped:Boolean,
    isCanceled:Boolean,
    TotalAmount: Number,
    TotalPointsRecived: Number,
    TotalPointsApply: Number,
    TotalQuantity: Number,
    date: Date,
  },
  { timestamps: true }
);

// order model
const Order = new mongoose.model("Order", orderSchema);

// cloudnary utils

cloudinary.config({
  cloud_name: "dtvjheadc",
  api_key: "754475414237671",
  api_secret: "0CxV47pUFZV7CKiztPEznofJj0A",
});

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res.status(statusCode).send({ message: "success", token });
};

app.post("/signin", async (req, res) => {
  const { Email, Password } = req.body;
//   console.log(Email);
  try {
    const user = await Admin.findOne({ email: Email }).select("+password");
    // console.log(user)
    if (user) {
      const isMatch = await user.matchPasswords(Password);
      // console.log(isMatch)
      if (isMatch) {
        sendToken(user, 200, res);
      } else {
        res.status(401).send({ message: "invalidpass" });
      }
    } else {
      res.status(401).send({ message: "Invalid Username" });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/signup", async (req, res) => {
  const { Email, Password } = req.body;
  try {
    const user = await Admin.findOne({ email: Email });

    if (user) {
      res.send({ message: "User already exsist ..." });
    } else {
      const user = new Admin({
        email: Email,
        password: Password,
      });

      //To save data to the database with error handling
      // user.save(err =>{
      //     if(err){
      //         res.send(err)

      //     }else{
      //         sendToken(user, 201 , res)
      //     }
      // })

      await user.save();
      sendToken(user, 201, res);
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/orders", async (req, res) => {
  const { email,selectedDate } = req.query;
  // const date = req.body.date
  // const tstamp = parseInt(timestamp);
  // console.log(tstamp)
  // console.log(date)

  console.log(email);
  try {
    const user = await User.findOne({ email: email });

    if (user) {
      console.log(user.email);
      // console.log(date)
      // const date = new Date(selectedDate)
      // console.log(year)
      const parsedDate = new Date(selectedDate);
    parsedDate.setHours(0, 0, 0, 0);
    const endofDay = new Date(selectedDate);
    endofDay.setHours(23,59,59,999);
    console.log(parsedDate)
      const orderList = await Order.find({
        userId: (user._id),
        createdAt:{
            $gte:parsedDate,
            $lte:endofDay
        }
      });
      console.log(orderList);
      if (!orderList) {
        res.send({ message: "Order Not found" });
      } else {
        res.send({ orderList: orderList,email:email});
      }
    } else {
      res.send("User Not Found");
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "internal server error" });
  }
});

app.get("/api/products",async(req,res)=>{
  const products = await Product.find({})
  if(!products){
    res.send({message:"Products not found"})
  }else{
    res.send({products:products})
  }
})

app.post("/api/product/add", async (req, res) => {
  const {
    ProductName,
    ProductBrand,
    Description,
    Category,
    SubCategory,
    Types,
    productImg,
  } = req.body;

  console.log(req.body);
  try {
    if (productImg) {
      const uploadRes = await cloudinary.uploader.upload(productImg, {
        upload_preset: "online-shop",
      });

      if (uploadRes) {
        const newProduct = new Product({
          ProductName,
          ProductBrand,
          Description,
          Category,
          SubCategory,
          Types,
          Image: uploadRes,
        });
        console.log(uploadRes);

        const savedProduct = await newProduct.save();

        res.status(200).send(savedProduct);
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// app.post("/api/product/add",upload.single('Image'),(req,res)=>{
//     console.log(req.body)
// const ProductName = req.body.ProductName;
// const Description = req.body.Description;
// const Price = req.body.Price;
// const Category = req.body.Category;
// const SubCategory = req.body.SubCategory;
// console.log(req.body.Image.File)
// const Image = req.file.filename;

// const Quantity = req.body.Quantity;

// const newProductData ={
//     ProductName,
//     Description,
//     Price,
//     Category,
//     SubCategory,
//     Image,
//     Quantity
// }

// const newProduct = new Product(newProductData)
// newProduct.save().then(()=>res.send({message:"product added"}))
// .catch(err => res.send({error:err}))

// })

app.get("/api/dashdata",async (req,res)=>{
 const orders= await Order.find({})
 if(orders){
  const products = await Product.find({})
  const DeliveredOrders = await Order.find({
    isDelivered:true
  })
  const DeliveredCount = DeliveredOrders.length

  res.send({orders:orders,products:products,DeliveredCount:DeliveredCount})
 }
})

app.get("/api/product/:id", (req, res) => {
  const id = req.params.id
  const product = Product.find({"_id":id});
  if(!product){
    res.send({message:"no product found"})
  }else{
    res.send({product:product})
  }
});

app.post("/api/product/:id",(req,res)=>{

})

app.get("/api/history", (req, res) => {});

const port = process.env.PORT || 3004;
app.listen(port, function () {
  console.log("Admin Server is running on port 3004...");
});
