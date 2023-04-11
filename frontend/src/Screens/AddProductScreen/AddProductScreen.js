import React, { useState } from "react";
import axios from "axios";

import "./AddProductScreen.css";

export default function AddProductScreen() {
  const [productImg, setProductImg] = useState("");
  const [ProductName, setProductName] = useState("");
  const [ProductBrand, setProductBrand] = useState("");
  // const [Price,setPrice] = useState("");
  const [Description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [SubCategory, setSubCategory] = useState("");
  // const [Types, setTypes] = useState("");
  // const [Quantity,setQuantity] = useState("");

  // const convertToArray =(e) =>{
  //     const  arrays = e.target.value.split(',')
  //     setCategory(arrays);
  //     // setCategory(e.target.value)
  // }

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    TransformFile(file);
  };

  const TransformFile = (file) => {
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setProductImg(reader.result);
      };
    } else {
      setProductImg("");
    }
  };

  const config = {
    header: {
      "Content-Type": "application/json",
    },
  };

  const addProduct = (e) => {
    // setCategory(Category.split(','))
    const Category = category.split(",");
    const Types = types;
    e.preventDefault();
    console.log(productImg);
    if(ProductName && ProductBrand && Description && category && Types && SubCategory && productImg){
        axios
          .post(
            "http://localhost:3004/api/product/add",
            {
              ProductName,
              ProductBrand,
              Description,
              Category,
              Types,
              SubCategory,
              productImg,
            },
            config
          )
          .then((res) => {
            console.log(res);
            alert("Product added successfully");
          })
          .catch((err) => {
            console.log(err);
          });
    }else{
        alert("fill complete details")
    }
  };
  const [type, setType] = useState({
    type: "",
    unit: "",
    size: "",
    price: "",
    quantity: "",
  });

  const [types, setTypes] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setType({
      ...type,
      [name]: value,
    });
  };
  const handleAddType = (e) => {
    // e.preventDefault()
    setTypes((types) => [...types, type]);

    // console.log(type)
  };

  // console.log(types)
  return (
    <div className="prod-add-div">
      {/* { console.log(Category)} */}
      <div className="container card prod-add">
        <div className="prod-img">
          {productImg ? (
            <img style={{marginTop: "10px"}} src={productImg} alt="productimage" />
          ) : (
            <h1 style={{marginTop: "100px"}}>Product image will appear here</h1>
          )}
        </div>
        {/* <br /> */}
        <input
        style={{border:"none"}}
          type="file"
          accept=".png, .jpg, .jpeg"
          name="Image"
          onChange={handlePhoto}
        />

        <div className="row">
          <div className="col">
            <input
              type="text"
              name="ProductName"
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Productname"
            />
          </div>
          <div className="col">
            <input
              type="text"
              name="ProductBrand"
              onChange={(e) => setProductBrand(e.target.value)}
              placeholder="ProductBrand"
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <textarea
            style={{marginTop: "10px"}}
              type="text"
              name="Description"
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <input
              type="text"
              name="category"
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
            />
          </div>
          <div className="col">
            <input
              type="text"
              name="SubCategory"
              onChange={(e) => setSubCategory(e.target.value)}
              placeholder="SubCategory"
            />
          </div>
        </div>

        <br />

        {/* <input type="text"  name="Price" onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
        <input type="text" name="Quantity" onChange={(e) => setQuantity(e.target.value)} placeholder="Quantity" /> */}

        <h2>Types</h2>
        <div className="row">
            <div className="col">
            <input
        className="type-input"
          type="text"
          value={type.type}
          onChange={handleChange}
          name="type"
          placeholder="type"
        />
            </div>
            <div className="col">
            <input
        className="type-input"
          type="text"
          value={type.unit}
          onChange={handleChange}
          name="unit"
          placeholder="unit"
        />
            </div>
            <div className="col">
            <input
        className="type-input"
          type="number"
          value={type.size}
          onChange={handleChange}
          name="size"
          placeholder="size"
        /> 
            </div>
            <div className="col">
            <input
        className="type-input"
          type="number"
          value={type.price}
          onChange={handleChange}
          name="price"
          placeholder="price"
        /> 
            </div>
            <div className="col">
            <input
        className="type-input"
          type="number"
          value={type.quantity}
          onChange={handleChange}
          name="quantity"
          placeholder="quantity"
        />
            </div>

            <div className="col">
        <button className="btn btn-outline-dark" onClick={handleAddType}>
          Add type
        </button>

            </div>

        </div>
        
        
        
       
       
        <br />

        <table className="table">
          <thead>
            <tr>
              <th scope="col">No.</th>
              <th scope="col">Unit</th>
              <th scope="col">Size</th>
              <th scope="col">Price</th>
              <th scope="col">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {types &&
              types.map((type, index) => (
                <tr key={index}>
                  <th className="col">{index + 1}</th>
                  <th className="col">{type.unit}</th>
                  <th className="col">{type.size}</th>
                  <th className="col">{type.price}</th>
                  <th className="col">{type.quantity}</th>
                </tr>
              ))}
          </tbody>
        </table>
        {/* {
            types? types.map((type) => (
                <div>{type.type} , {type.unit} , {type.size}, {type.price}, {type.quantity}</div>
              )):<h1>list will be added here</h1>
        } */}
        <br />

        {/* <input type="text" placeholder="color" />
        <input type="file"  />
        <button  >Add color</button> */}
        <input type="submit" className="btn btn-dark" onClick={addProduct} />
      </div>
    </div>
  );
}
