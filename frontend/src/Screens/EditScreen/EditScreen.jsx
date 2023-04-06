import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditScreen() {
  const params = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
//   const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  useEffect(() => {
    
    const getProduct = async () => {
      const { data } = await axios.get(
        `http://localhost:3004/api/product/${params.id}`
      );
      setName(data.product.ProductName);
      setBrand(data.product.ProductName)
      setDescription(data.product.Description)
      setCategory(data.product.category)
      setSubCategory(data.product.SubCategory)
      // console.log(data.TotalOrders,data.TotalOrderDelivered)
      //   setOrder(data.orders)
    };

    if (!localStorage.getItem("AdminAuthToken")) {
      navigate("/signin");
    } else {
      getProduct();
    }
  }, [navigate, params.id]);

  return (
    <>
      Edit stock
      <div className="container">
        <div>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Productname"
          />
          <br />
          <input
            type="text"
            name="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="ProductBrand"
          />
          <br />
          <textarea
            type="text"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
          <br />
          <input
            type="text"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
          />
          <br />
          <input
            type="text"
            name="subCategory"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            placeholder="SubCategory"
          />
          <br />
        </div>
      </div>
    </>
  );
}
