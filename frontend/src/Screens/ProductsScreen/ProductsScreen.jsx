import React, { useEffect, useState } from "react";

import "./ProductsScreen.css"
import axios from "axios";
import { useNavigate } from "react-router-dom";
const itemsPerPage = 10;

export default function ProductsScreen(){
    const [products, setProducts] = useState('');
    const navigate = useNavigate()

    useEffect(()=>{
        const config ={
            header :{
              "Content-Type":"application/json"
            }
          }
      const getProduct =async()=>{
          const {data} = await axios.get("http://localhost:3004/api/products",config)
      // console.log(data.TotalOrders,data.TotalOrderDelivered)
      setProducts(data.products)

      }
      if(!localStorage.getItem("AdminAuthToken")){
        navigate("/signin")
    }else{
        getProduct()
    }
    },[navigate])

    const handleProductDelete = async(id)=>{
      await axios.post(`http://localhost/api/productdelete/${id}`).then((res)=>{
        alert(`${res.data.message}`)
        window.location.reload(true);
      }).catch(err=>{console.log(err)})
    }

    const [currentPage, setCurrentPage] = useState(1);

  const pageCount = Math.ceil(products.length / itemsPerPage);

  const handleClick = (event) => {
    setCurrentPage(Number(event.target.id));
  };

  const handleEditClick = (ID) =>{
    navigate(`/editproduct/${ID}`)
  }

  const renderPageNumbers = () => {
    const pageNumbers = [];

    for (let i = 1; i <= pageCount; i++) {
      pageNumbers.push(
        <li key={i} id={i} onClick={handleClick}>
          {i}
        </li>
      );
    }

    return pageNumbers;
  };

  const renderData = () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return products.slice(start, end).map((product, index) => (
        <div className="container" key={index}>
            <div className="row">
                <div className="col-2">
                    {index+1}
                </div>
                <div className="col-2">
                    <img style={{width: "90px"}}src={product.Image.url} alt="proimage" />
                </div>
                <div className="col-6">
                    
                {product.ProductName}
                </div>
                <div className="col-2">
                    <button className="btn btn-dark" onClick={()=>handleEditClick(product._id)} >Edit</button>
                    <button className="btn btn-outline-dark" onClick={()=>handleProductDelete(product._id)}>Delete</button>
                </div>
            </div>
            <hr/>
        </div>
    ));
    
  };

    // console.log(products)
    return(
        <div className="container prod-screen">
          <div className="row">
            <div className="col">
            <h2>Product in stocks</h2>

            </div>
            <div className="col" style={{textAlign: "end"}}>
              <button onClick={()=>{navigate("/addproduct")}} className="btn btn-outline-dark">+ Add Product</button>
            </div>
          </div>
            <hr/>
        {products && renderData()}
        <ul>
        {products && renderPageNumbers()}

        </ul>
        </div>
    )
}