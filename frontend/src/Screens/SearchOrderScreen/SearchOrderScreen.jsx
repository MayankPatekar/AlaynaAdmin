/* eslint-disable no-restricted-globals */
import axios from "axios";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function SearchOrderScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState("");

  function handleDateChange(date) {
    setSelectedDate(date);
  }
  const searchOrder = async () => {
    try {
      const date = selectedDate.toISOString().substring(0, 10);
      //     const date = new Date(selectedDate);
      //     const timestamp = date.getTime();
      // console.log(timestamp)
      console.log(date);
      const config = {
        header: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.get(
        `http://localhost:3004/api/orders?email=${email}&selectedDate=${date}`,
        config
      );
      if (data.orderList) {
        setOrders(data.orderList);
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(selectedDate);
  console.log(email);
  return (
    <>
      {console.log(orders)}
      <div className="container">
        <h1>Search Orders</h1>
        <div className="row">
          <div className="col">
            <label htmlFor='="search-email'>Enter Email:</label>
            <div>
              <input
                id="search-email"
                value={email}
                name="email"
                onChange={() => {
                  setEmail(event.target.value);
                }}
              />
            </div>
          </div>
          <div className="col">
            <label htmlFor="date-input">Select a date:</label>
            <DatePicker
              id="date-input"
              selected={selectedDate}
              onChange={handleDateChange}
            />
          </div>
          <div className="col">
            <div style={{ margin: "16px" }}>
              <button className="btn btn-dark" onClick={searchOrder}>
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="container">
          <h3>Your Result will display below</h3>
          <div className="row">
            {orders &&
              orders.slice(0).reverse().map((order) => (
                <div className=" container row" id={order._id}>
                  <div className="col-sm-5 card">
                    <div className="card-body">
                      <h3>Shipping details</h3>
                      <div class="row">
                        <div class="col-sm-3">
                          <h6 class="mb-0">User Email :</h6>
                        </div>
                        <div class="col-sm-9 text-secondary">
                          {email}
                        </div>
                      </div>
                      <hr />
                      <div class="row">
                        <div class="col-sm-3">
                          <h6 class="mb-0">Full Name</h6>
                        </div>
                        <div class="col-sm-9 text-secondary">
                          {order.shippingDetails[0].FirstName} {" "}{order.shippingDetails[0].LastName}
                        </div>
                      </div>
                      <hr />
                      <div class="row">
                        <div class="col-sm-3">
                          <h6 class="mb-0">Address</h6>
                        </div>
                        <div class="col-sm-9 text-secondary">
                          {order.shippingDetails[0].Address} {" ,"}{order.shippingDetails[0].City}
                        </div>
                      </div>
                      <hr />
                      <div class="row">
                        <div class="col-sm-3">
                          <h6 class="mb-0">Pincode</h6>
                        </div>
                        <div class="col-sm-9 text-secondary">
                          {order.shippingDetails[0].PinCode}
                        </div>
                      </div>
                      <hr />
                      <div class="row">
                        <div class="col-sm-3">
                          <h6 class="mb-0">State</h6>
                        </div>
                        <div class="col-sm-9 text-secondary">
                          {order.shippingDetails[0].State}
                        </div>
                      </div>
                      <hr />
                    </div>
                  </div>
                  <div className="col-sm-7 card">
                    <div className="card-body">
                      <h3>Product details</h3>
                      <div className="row">
                        {
                          order.Items.map((product)=>(
                            <div className="row" key={product.price + product.SelectedSize}>
                <div className="col-sm">
                  <div className="row">
                    <img
                      className="col-sm"
                      src={product.Image.url}
                      alt="product-img"
                      style={{height: "120px",
                        objectFit: "contain"}}
                    />
                    <h4 className="col-sm" style={{ fontSize: "15px" }}>
                      {product.ProductName}{" "}
                      {product.SelectedSize} {" "}{product.Types[0].unit}
                    </h4>
                    <div className="row"></div>
                  </div>
                </div>
                <div className="col-sm">
                  <div className="row">
                    <h4 className="col-sm" style={{ textAlign: "center" }}>
                      {product.price} * {product.cartQuantity}
                    </h4>
                    <h4 className="col-sm" style={{ textAlign: "center" }}>
                      <span>= {product.price * product.cartQuantity}</span>
                    </h4>
                  </div>
                </div>
              </div>
                          ))
                        }
                        <hr/>
                      <div class="row">
                        <div class="col-sm-9">
                          <h6 class="mb-0">Total Items</h6>
                        </div>
                        <div class="col-sm-3 text-secondary">
                          {order.TotalQuantity}
                        </div>
                      </div>
                        <div class="row">
                        <div class="col-sm-9">
                          <h6 class="mb-0">Total Price</h6>
                        </div>
                        <div class="col-sm-3 text-secondary">
                          {order.TotalAmount}
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-sm-9">
                          <h6 class="mb-0">Total Point Recived</h6>
                        </div>
                        <div class="col-sm-3 text-secondary">
                          {order.TotalPointsRecived}
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-sm-9">
                          <h6 class="mb-0">Total Points Applied</h6>
                        </div>
                        <div class="col-sm-3 text-secondary">
                          {order.TotalPointsApply}
                        </div>
                      </div>
                      
                      <hr />
                      </div>
                    </div>
                  </div>
                  {/* <div className="col-sm card">
                    <div className="card-body">
                      <h3>User Details</h3>
                    </div>
                  </div> */}
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
