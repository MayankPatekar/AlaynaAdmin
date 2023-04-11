import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./EditScreen.css"

export default function EditScreen() {
  const params = useParams();
  const id = params.id;
  // const [visible,setVisible] = useState(false)
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  //   const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
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
  const config ={
    header :{
      "Content-Type":"application/json"
    }
  }
  const handleAddType = async() => {
    console.log(type)
    await axios.post(`http://localhost:3004/api/type/add?id=${id}`,{type},config).then((res)=>{
      alert(`${res.data.message}`)
      window.location.reload(true);
      // navigate(`/editproduct/${id}`);
    })
    // e.preventDefault()
    // setTypes((types) => [...types, type]);
    // console.log(type)
  };

  useEffect(() => {
    const getProduct = async () => {
      const { data } = await axios.get(
        `http://localhost:3004/api/product/${id}`
      );
      setName(data.product.ProductName);
      setBrand(data.product.ProductName);
      setDescription(data.product.Description);
      setCategory(data.product.Category);
      setSubCategory(data.product.SubCategory);
      setTypes(data.product.Types);
      // console.log(data.TotalOrders,data.TotalOrderDelivered)
      // console.log(data.product)
    };

    if (!localStorage.getItem("AdminAuthToken")) {
      navigate("/signin");
    } else {
      getProduct();
    }
  }, [id, navigate]);

  const handleUpdateProduct =async()=>{
    if(name && description && brand && category && subCategory){

      await axios.post(`http://localhost:3004/api/product/${id}`,{name,description,brand,category,subCategory}).then((res)=>{
        alert(`${res.data.message}`)
        window.location.reload(true);
      }).catch(err=>{console.log(err)})
    }else{
      alert("Fill complete details")
    }
  }

  const handleTypeDelete = async (typeid) => {
    await axios
      .post(`http://localhost:3004/api/type/delete?id=${id}&typeid=${typeid}`)
      .then((res) => {
        alert(`${res.data.message}`);
        window.location.reload(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // console.log(types)
  return (
    <>
      {name && (
        <div className="container edit-prod-div">
          <div className="card" style={{padding: "25px 20px"}}>

          <h2>Edit Product</h2>
          <div>
            <div className="row">
              <div className="col">
              <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Productname"
              />
              </div>
              <div className="col">
              <input
              type="text"
              name="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="ProductBrand"
            />
              </div>
            </div>
            <div className="row">
              <div className="col">
              <textarea
              type="text"
              name="description"
              value={description}
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
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
            />
              </div>
              <div className="col">
              <input
              type="text"
              name="subCategory"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              placeholder="SubCategory"
            />
              </div>
            </div>
           
            <br />
            <button className="btn btn-dark" onClick={handleUpdateProduct}>Update</button>
            <br />
            <bt />
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Unit</th>
                  <th scope="col">Size</th>
                  <th scope="col">Price</th>
                  <th scope="col">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {types.map((type) => (
                  <tr key={type._id}>
                    <th className="col">{type.unit}</th>
                    <th className="col">{type.size}</th>
                    <th className="col">{type.price}</th>
                    <th className="col">{type.quantity}</th>
                    <button
                    className="btn btn-dark"
                    style={{backgroundColor:"#212529"}}
                      onClick={() => {
                        navigate(`/product/edittype/${type._id}?id=${id}`);
                      }}
                    >
                      Edit
                    </button>
                    <button
                    className="btn btn-outline-dark"
                      onClick={() => {
                        handleTypeDelete(type._id);
                      }}
                    >
                      Delete
                    </button>
                  </tr>
                ))}
              </tbody>
            </table>

            {}

            <div className="row">
              <div className="col">
              <input
              type="text"
              value={type.unit}
              onChange={handleChange}
              name="unit"
              placeholder="unit"
              />
              </div>
              <div className="col">
              <input
              type="number"
              value={type.size}
              onChange={handleChange}
              name="size"
              placeholder="size"
            />
              </div>
              <div className="col">
              <input
              type="number"
              value={type.price}
              onChange={handleChange}
              name="price"
              placeholder="price"
            />
              </div>
              <div className="col">
              <input
              type="number"
              value={type.quantity}
              onChange={handleChange}
              name="quantity"
              placeholder="quantity"
            />
              </div>
              <div className="col">
            <button style={{marginTop: "5px"}} className="btn btn-dark" onClick={handleAddType}>Add Type</button>
              </div>

            </div>

            
            
            
            


            {/* {types.map((type) => (
              <>
              <h2>Types</h2>
                <input
                  type="text"
                  value={type.type}
                  onChange={handleChange}
                  name="type"
                  placeholder="type"
                  />
                  <input
                  type="text"
                  value={type.unit}
                  onChange={handleChange}
                  name="unit"
                  placeholder="unit"
                />
                <input
                  type="number"
                  value={type.size}
                  onChange={handleChange}
                  name="size"
                  placeholder="size"
                />
                <input
                  type="number"
                  value={type.price}
                  onChange={handleChange}
                  name="price"
                  placeholder="price"
                />
                <input
                  type="number"
                  value={type.quantity}
                  onChange={handleChange}
                  name="quantity"
                  placeholder="quantity"
                />
                <button onClick={handleAddType}>Add type</button>
                <br />
              </>
            ))} */}
          </div>
      </div>
        </div>
      )}
    </>
  );
}
