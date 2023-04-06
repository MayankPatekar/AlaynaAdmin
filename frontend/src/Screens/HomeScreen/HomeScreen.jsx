import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./HomeScreen.css";
import axios from "axios";
// import LatestOrder from "../../Components/LatestOrder/LatestOrder";
export default function HomeScreen() {
  const [Order, setOrder] = useState([]);
  const [product,setProduct] = useState([]);
  const [deliverCount,setDeliverCount] = useState(0)
  const [totalRevenue,setTotalRevenue] = useState(0);
  // const [deliver,setDeliver] = useState('')
  const navigate = useNavigate();
  useEffect(() => {
    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };
    const getProduct = async () => {
      const { data } = await axios.get(
        "http://localhost:3004/api/dashdata",
        config
      );
      // console.log(data.TotalOrders,data.TotalOrderDelivered)
      setOrder(data.orders);
      setProduct(data.products)
      setDeliverCount(data.DeliveredCount)
      const total = data.orders.reduce((accumulator, item) => {
        return accumulator + item.TotalAmount;
      }, 0);
      setTotalRevenue(total)

      console.log(data.orders);
    };

    if (!localStorage.getItem("AdminAuthToken")) {
      navigate("/signin");
    } else {
      getProduct();
    }
  }, [navigate]);

  return (
    <>
      <link
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"
        rel="stylesheet"
      />
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-sm-6">
            <div className="card-box bg-red">
              <div className="inner">
                <h3> {product.length} </h3>
                <p> Total Products </p>
              </div>
              <div className="icon">
                <i className="fa fa-bitbucket"></i>
              </div>
              <a href="/productstocks" className="card-box-footer">
                View More <i className="fa fa-arrow-circle-right"></i>
              </a>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6">
            <div className="card-box bg-blue">
              <div className="inner">
                <h3> {Order && <>{Order.length}</>} </h3>
                <p> Total Orders </p>
              </div>
              <div className="icon">
                <i className="fa fa-inbox" aria-hidden="true"></i>
              </div>
              <a href="/searchorder" className="card-box-footer">
                Search Orders <i className="fa fa-arrow-circle-right"></i>
              </a>
            </div>
          </div>

          <div className="col-lg-3 col-sm-6">
            <div className="card-box bg-orange">
              <div className="inner">
                <h3> {deliverCount} </h3>
                <p> Order Delivered </p>
              </div>
              <div className="icon">
                <i className="fa fa-dropbox" aria-hidden="true"></i>
              </div>
              <a href="/" className="card-box-footer">
                Search Orders <i className="fa fa-arrow-circle-right"></i>
              </a>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6">
            <div className="card-box bg-green">
              <div className="inner">
                <h3> ₹{totalRevenue} </h3>
                <p> Total Collection </p>
              </div>
              <div className="icon">
                <i className="fa fa-money" aria-hidden="true"></i>
              </div>
              <a href="/" className="card-box-footer">
                View More <i className="fa fa-arrow-circle-right"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="container" style={{boxShadow: "1px 1px 2px #353333"}}>
          <h2>Lastest Orders</h2>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Full Name</th>
                <th scope="col">Total Quantity</th>
                <th scope="col">Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
                {Order?.slice(0)
          .reverse().map((or)=>(

              <tr key={or._id}>
                <th scope="row">{or._id}</th>
                <td>{or.shippingDetails[0].FirstName}{" "}
                    {or.shippingDetails[0].FirstName}</td>
                <td>{or.TotalQuantity}</td>
                <td>{or.TotalAmount}</td>
                <td>View</td>
              </tr>
                ))}
            </tbody>
          </table>
        </div>

        
      </div>
    </>
  );
}
