import React, { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import "./ViewGraphScreen.css"
import axios from "axios";
export default function ViewGraphScreen(){
    const [data, setData] = useState([]);

//     useEffect(() => {

//         const generateData =async()=>{
// return await axios.get("http://localhost:3004/api/dashdata")
//         }

//         const interval = setInterval(() => {
//           const newData = generateData(); // Generate new data
          
//           setData([...data, newData.orders]); // Add new data to existing data
//         }, 1000);
//         return () => clearInterval(interval);
//       }, [data]);
    //   console.log(data)
    return(
        <>graph
        <LineChart width={500} height={300} data={data}>
  <Line type="monotone" dataKey="TotalAmount" stroke="#8884d8" />
  <CartesianGrid stroke="#ccc" />
  <XAxis dataKey="time" />
  <YAxis />
  <Tooltip />
  <Legend />
</LineChart>

        </>
    )
}