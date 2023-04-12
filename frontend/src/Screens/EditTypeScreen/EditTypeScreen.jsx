import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function EditTypeScreen() {
  const queryParameters = new URLSearchParams(window.location.search);
  const id = queryParameters.get("id");
//   console.log(id);
  const params = useParams();
  const [unit, setUnit] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  //   const [type,setType] = useState({
  //     unit:"",
  //     size:"",
  //     price:"",
  //     quantity:"",
  //   })

  const typeid = params.typeid;
// console.log(typeid,id)
  useEffect(() => {
    try {
      const getType = async () => {
        const { data } = await axios.get(
          `http://localhost:3004/api/type/get?id=${id}&typeid=${typeid}`
        );
        // console.log(data.Type)
        // setType(Type)
        if (data.Type) {
          setUnit(data.Type.unit);
          setSize(data.Type.size);
          setPrice(data.Type.price);
          setQuantity(data.Type.quantity);
        }
      };

      getType();
    } catch (err) {
      console.log(err);
    }
  }, [id, typeid]);

  const handleUpdateType = async() => {
    if(unit && size && quantity && price){

      await axios.post(`http://localhost:3004/api/type/post?id=${id}&typeid=${typeid}`,{unit,size,quantity,price}).then((res)=>{
        alert(`${res.data.message}`)
        // navigate("/profile")
        
      }).catch(err=>console.log(err))
    }else{
      alert("Fill complete details")
    }

  };
//   const handleAddType = () => {};
  return (
    <div className="container ">
      <h2>Types</h2>
      {/* <input type="text" value={type.type} onChange={handleChange} name="type"  placeholder="type"/> */}
      {unit && (
        <>
          <input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            name="unit"
            placeholder="unit"
          />
          <input
            type="number"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            name="size"
            placeholder="size"
          />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            name="price"
            placeholder="price"
          />
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            name="quantity"
            placeholder="quantity"
          />
          <button className="btn btn-outline-dark" onClick={handleUpdateType}>
            Update type
          </button>
          <br />
        </>
      )}
    </div>
  );
}
