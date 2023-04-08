import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinaryModule from "cloudinary";
const cloudinary = cloudinaryModule.v2;
import nodemailer from "nodemailer";
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
    isPacked: Boolean,
    isShipped: Boolean,
    isCanceled: Boolean,
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

const sendEmail = (options) =>{
  const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
      user: 'alaynaweb@outlook.com', // sender email
      pass: 'pp4347@viksmaya' // sender password
  }
  });

  // console.log(options.to)
  const mailOptions = {
      from : "alaynaweb@outlook.com",
      to: options.to,
      subject: options.subject,
      html:options.text,
  };

  transporter.sendMail(mailOptions,function(err,info){
      if(err){
          console.log(err)
          console.log("error")
      }else{
          console.log(info)
          console.log("info")
      }
  });
  
};
// ---------------------------------------------------//
// ---------------ROUTES-------------------------------//
// ---------------------------------------------------//

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

// ---------------------------------------------------//
// ---------ALL ORDER RELATED ROUTES---------------//
// ---------------------------------------------------//

// for fetching order with email and date
app.get("/api/orders", async (req, res) => {
  const { email, selectedDate } = req.query;
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
      endofDay.setHours(23, 59, 59, 999);
      console.log(parsedDate);
      const orderList = await Order.find({
        userId: user._id,
        createdAt: {
          $gte: parsedDate,
          $lte: endofDay,
        },
      });
      console.log(orderList);
      if (!orderList) {
        res.send({ message: "Order Not found" });
      } else {
        res.send({ orderList: orderList, email: email });
      }
    } else {
      res.send("User Not Found");
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "internal server error" });
  }
});

// view orders by day month year
app.get("/api/vieworders", async (req, res) => {
  const { type, selectedDate } = req.query;
console.log(selectedDate)
  const parsedDate = new Date(selectedDate);
  parsedDate.setHours(0, 0, 0, 0);
  const endofDay = new Date(selectedDate);
  endofDay.setHours(23, 59, 59, 999);
  console.log(parsedDate)
  console.log(endofDay)
  try{

    if (type === "Day") {
      const orderList = await Order.find({
        createdAt: {
          $gte: parsedDate,
          $lte: endofDay,
        },
      });
      if (orderList) {
        res.send({ orderList: orderList });
      }
    } else if (type === "Monthly") {
      const date = new Date(parsedDate);
      const month = date.getMonth() + 1;
      const orderList = await Order.find({
        $expr: { $eq: [{ $month: "$createdAt" }, month] },
      });
      if (orderList) {
        res.send({ orderList: orderList });
      }
    } else if (type === "Yearly") {
      const date = new Date(parsedDate);
      const year = date.getFullYear();
      const orderList = await Order.find({
        $expr: { $eq: [{ $year: '$createdAt' }, year] },
      });
      if (orderList) {
        res.send({ orderList: orderList });
      }
    }

  }catch(err){
    console.log(err)
  }

});

// to get particular order by id
app.get("/api/order/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const order = await Order.findOne({ _id: id });
    if (!order) {
      res.send({ message: "order not found" });
    } else {
      const user = await User.findOne({ _id: order.userId });
      res.send({ order: order, user: user });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/order/:id", async (req, res) => {
  const changePart = req.body.name;
  const id = req.params.id;
  const email = req.body.email;
  const order = await Order.findOne({ _id: id });
  const user = await User.findOne({email:email})
  if (!order) {
    res.send({ message: "order not found" });
  } else {
    if (changePart === "packed") {
      order.isPacked = true;
      await order.save();
      const message = `<h1>Your Order is Packed</h1><br/><p>You can expect your order within 5 days</p>`
      await sendEmail({
        to : "mayankpatekar112345@gmail.com",
        subject:`#${order._id} is Packed`,
        text : "<h1>test mail</h1>"
    })
      res.send({ message: "Product updated" });
    } 
    else if (changePart === "shipped") {
      order.isShipped = true;
      await order.save();
      
      res.send({ message: "Product updated" });
    } 
    else if (changePart === "paid") {
      order.isPaid = true;
      await order.save();

      res.send({ message: "Product updated" });
    } else if (changePart === "delivered") {
      order.isDelivered = true;
      await order.save();
      user.points = user.points + order.TotalPointsRecived;
      await user.save();
      
      res.send({ message: "Product updated" });
    }
  }
});

// ---------------------------------------------------//
// -----------ALL PRODUCT RELATED ROUTES-------------//
// ---------------------------------------------------//

// for fetching products
app.get("/api/products", async (req, res) => {
  const products = await Product.find({});
  if (!products) {
    res.send({ message: "Products not found" });
  } else {
    res.send({ products: products });
  }
});

// for adding product to database
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

// to get particular product by id
app.get("/api/product/:id", async (req, res) => {
  const id = req.params.id;
  const product = await Product.findOne({ _id: id });
  if (!product) {
    res.send({ message: "no product found" });
  } else {
    res.send({ product: product });
  }
});

// to edit particular(specially quantity) product by id
app.post("/api/product/:id",async(req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const description = req.body.description
  const brand = req.body.brand
  var category;
  if(req.body.category.includes(",")){
     category = req.body.category.split(",")
  }else{
     category = [req.body.category]
  }
  // const category = req.body.category
  const subcategory = req.body.subCategory
  const product = await Product.findOne({_id:id})
  product.ProductName=name,
  product.Description = description,
  product.ProductBrand = brand,
  product.Category = category
  product.SubCategory = subcategory
  product.save()
  res.send({message:"Product update successfully"})
});

app.post("/api/productdelete/:id",async(req,res)=>{
  const id = req.params.id;
  try{

    await Product.deleteOne({_id:id})
    res.send({message:"Product delete"})
  }catch(err){
    console.log(err)
  }
})

// ---------------------------------------------------//
// ----------ALL TYPE RELATED ROUTES---------------//
// ---------------------------------------------------//

// get type
app.get("/api/product/type",async(req,res)=>{
  const {id,typeid} = req.query;

  console.log(id)
  try{

    const product = await Product.findOne({_id:id})
    console.log(product)
    product.Types.forEach((type)=>{
      console.log(type._id.toString())
      if(type._id.toString()===typeid){
        // console.log("type is here")
        console.log(type)
        res.send({Type:type})
      }
    })
  }catch(err){
    console.log("err")
  }


})
// edit type
app.post("/api/product/type",async(req,res)=>{
  const {id,typeid} = req.query;
  const {unit,size,quantity,price} = req.body;
  // console.log(id," ",typeid)
  // console.log("from backend ")
  try{

    const product = await Product.findOne({_id:id})
    product.Types.forEach(async (type)=>{
      if(type._id.toString()===typeid){
        type.size = size,
        type.unit = unit,
        type.quantity = quantity,
        type.price = price,
        await product.save();
        res.send({message:"Type updated successfully"})
        
      }
    })
  }catch(err){
    res.send(err)
  }

})

// delete type
app.post("/api/type/delete",async(req,res)=>{
  const {id,typeid} = req.query;
  const product = await Product.findOne({_id:id})
  var typeSize=0; 
  product.Types.forEach((type)=>{
    if(type._id.toString()===typeid){
      typeSize = type.size;
    }
  })
  // console.log(typeSize)
  // Product.updateOne(
  //   { _id: id }, // Filter to match the product document by ID
  //   { $pull: { Types: { size: typeSize } } } // Use $pull to remove the Types object with the matching typeNo
  //   // (err, result) => {
  //   //   if (err) {
  //   //     console.log('Error removing Types object:', err);
  //   //     return;
  //   //   }
  //   //   console.log('Types object removed:', result);
  //   // }
  // );
  if(product.Types.length > 1){
    product.Types = product.Types.filter(type => type.size !== typeSize);
    product.save();
    res.send({message:"Type delete successfully"})

  }else{
    res.send({message:"You atleast have to keep one type"})
  }
  // product.Types.deleteOne({_id:typeid})

})
// add type
app.post("/api/type/add",async(req,res)=>{
  const {id} = req.query;
  // console.log(req.body.type)
  // const {unit,size,price,quantity} = req.body.type;
  const unit = req.body.type.unit
  const size = Number(req.body.type.size)
  const price = Number(req.body.type.price)
  const quantity = Number(req.body.type.quantity)
  // console.log(type)
  // console.log(unit,size,price,quantity)
  const product = await Product.findOne({_id:id})
  if(!product.Types){
    product.Types = []
  }
  const newType = {
    // typeNo: 0,
    unit: unit,
    size: size,
    price: price,
    quantity: quantity,
  };
  product.Types.push(newType)
  product.save();
  res.send({message:"Type added successfully"})

})

// ---------------------------------------------------//
// getting info for dashboard
app.get("/api/dashdata", async (req, res) => {
  const orders = await Order.find({});
  if (orders) {
    const products = await Product.find({});
    const DeliveredOrders = await Order.find({
      isDelivered: true,
    });
    const DeliveredCount = DeliveredOrders.length;

    res.send({
      orders: orders,
      products: products,
      DeliveredCount: DeliveredCount,
    });
  }
});

app.get("/api/history", (req, res) => {});
// ---------------------------------------------------//
const port = process.env.PORT || 3004;
app.listen(port, function () {
  console.log("Admin Server is running on port 3004...");
});
