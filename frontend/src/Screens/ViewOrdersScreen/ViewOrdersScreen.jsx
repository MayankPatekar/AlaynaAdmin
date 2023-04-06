/* eslint-disable no-restricted-globals */
import axios from "axios";
import React, { useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";

export default function ViewOrdersScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedOption, setSelectedOption] = useState(null);
  //   const [email, setEmail] = useState("");
    const [orders, setOrders] = useState([]);
  function handleDateChange(date) {
    setSelectedDate(date);
  }
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const searchOrder = async()=>{
    try{
        // console.log(selectedDate)
        const date = selectedDate.toISOString().substring(0, 10);
        // console.log(date)
        const config = {
            header: {
              "Content-Type": "application/json",
            },
          };
          const { data } = await axios.get(
            `http://localhost:3004/api/vieworders?type=${selectedOption}&selectedDate=${date}`,
            config
          );
          if (data.orderList) {
            setOrders(data.orderList);
          } else {
            console.log(data);
          }

    }catch(err){
        console.log(err)
    }
  }
// console.log(orders)
// console.log(selectedOption)
  return (
    <div className="container">
      <h1>View Orders</h1>
      <div className="row">
        <div className="col">
          <label htmlFor="date-input">Select a date:</label>
          <DatePicker
            id="date-input"
            selected={selectedDate}
            onChange={handleDateChange}
          />
        </div>
        <div className="col row" style={{alignItems: "center"}}>
          <div className="col">
            <label>
              <input
                type="radio"
                value="Day"
                checked={selectedOption === "Day"}
                onChange={handleOptionChange}
              />
              Day
            </label>
          </div>
          <div className="col">
            <label>
              <input
                type="radio"
                value="Monthly"
                checked={selectedOption === "Monthly"}
                onChange={handleOptionChange}
              />
              Monthly
            </label>
          </div>
          <div className="col">
            <label>
              <input
                type="radio"
                value="Yearly"
                checked={selectedOption === "Yearly"}
                onChange={handleOptionChange}
              />
              Yearly
            </label>
          </div>
        </div>

        <div className="col">
          <div style={{ margin: "16px" }}>
            <button className="btn btn-dark" onClick={searchOrder}>Search</button>
          </div>
        </div>
      </div>
      <div className="container">
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
                {orders?.slice(0)
          .reverse().map((or)=>(

              <tr key={or._id}>
                <th scope="row">{or._id}</th>
                <td>{or.shippingDetails[0].FirstName}{" "}
                    {or.shippingDetails[0].FirstName}</td>
                <td>{or.TotalQuantity}</td>
                <td>{
                    <div>Confirm order</div>
                    }</td>
                <td>{or.TotalAmount}</td>
                <td><Link to={`/order/${or._id}`}>View</Link></td>
              </tr>
                ))}
            </tbody>
          </table>
      </div>
    </div>
  );
}
