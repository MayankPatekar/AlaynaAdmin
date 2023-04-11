/* eslint-disable no-restricted-globals */
import axios from "axios";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";

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
          <table className="table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Full Name</th>
                <th scope="col">Total Quantity</th>
                <th scope="col">Status</th>
                <th scope="col">Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
                {orders && orders?.slice(0)
          .reverse().map((or)=>(

              <tr key={or._id}>
                <th scope="row">{or.OrderId}</th>
                <td>{or.shippingDetails[0].FirstName}{" "}
                    {or.shippingDetails[0].LastName}</td>
                <td>{or.TotalQuantity}</td>
                <td>
                    {or.isCanceled?<>Order Cancel</>:or.isDelivered?<>Order Delivered</>:or.isShipped?<>Order Shipped</>:or.isPacked?<>Order Packed</>:<>Order Confirm</>}
                    </td>
                <td>{or.TotalAmount}</td>
                <td><Link to={`/order/${or._id}`}>View</Link></td>
              </tr>
                ))}
            </tbody>
          </table>
          
        </div>
      </div>
    </>
  );
}
