import React, { useState } from "react";
import axios from "axios";



export default function AddProductScreen(){
    
    const [productImg,setProductImg] = useState("");
    const [ProductName,setProductName] = useState("");
    const [ProductBrand,setProductBrand] = useState("");
    // const [Price,setPrice] = useState("");
    const [Description,setDescription] = useState("");
    const [category,setCategory] = useState("");
    const [SubCategory,setSubCategory] = useState("");
    // const [Types, setTypes] = useState("");
    // const [Quantity,setQuantity] = useState("");

    // const convertToArray =(e) =>{
    //     const  arrays = e.target.value.split(',')
    //     setCategory(arrays);
    //     // setCategory(e.target.value)
    // }
    
    const handlePhoto = (e) =>{
        const file = e.target.files[0]
        TransformFile(file)
    }

    const TransformFile =(file)=>{
        const reader = new FileReader()

        if(file){
            reader.readAsDataURL(file)
            reader.onloadend =()=>{
                setProductImg(reader.result);
            }
        }else{
            setProductImg("")
        }
    }
    
    const config ={
        header :{
          "Content-Type":"application/json"
        }
      }
      
    const addProduct = (e) =>{
        // setCategory(Category.split(','))
        const Category = category.split(',')
        const Types = types
        e.preventDefault();
        console.log(productImg);
        axios.post('http://localhost:3004/api/product/add',{ProductName,ProductBrand,Description,Category,Types,SubCategory,productImg},config)
        .then((res)=>{
            console.log(res)
            alert("Product added successfully")
        })
        .catch(err=>{
            console.log(err);
        })

    }
    const [type,setType] = useState({
        type:"",
        unit:"",
        size:"",
        price:"",
        quantity:"",
    })

    const [types, setTypes] = useState([])



    const handleChange = (e) =>{
        const {name,value} = e.target;
        setType({
            ...type,
            [name]:value
        })
    }
    const handleAddType = (e) =>{
        // e.preventDefault()
        setTypes(types =>[

            ...types,
            type
        ]
        )

        // console.log(type)
    }
    
    console.log(types)
    return(
        <>
       {/* { console.log(Category)} */}
        <div className="container prod-add" >
            <div>{productImg ? <img src={productImg} alt="productimage" /> :<h1>Product image will appear here</h1>}</div>
            <input type="file" accept=".png, .jpg, .jpeg" name="Image" onChange={handlePhoto}/>
        
        <br/><input 
        type="text" 
        name="ProductName" 
        onChange={(e)=> setProductName(e.target.value)} 
        placeholder="Productname" 
        
        />
       <br/>
       <input 
        type="text" 
        name="ProductBrand" 
        onChange={(e)=> setProductBrand(e.target.value)} 
        placeholder="ProductBrand" 
        
        />
       <br/>
       <textarea type="text" name="Description" onChange={(e) =>setDescription(e.target.value) } placeholder="Description" />
       <br/>
        <input type="text"  name="category" onChange={(e) =>setCategory(e.target.value)} placeholder="Category" />
       <br/>
        <input type="text"  name="SubCategory" onChange={(e) => setSubCategory(e.target.value)} placeholder="SubCategory" />
        <br/>


<br/>

        {/* <input type="text"  name="Price" onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
        <input type="text" name="Quantity" onChange={(e) => setQuantity(e.target.value)} placeholder="Quantity" /> */}

        <h2>Types</h2>
        <input type="text" value={type.type} onChange={handleChange} name="type"  placeholder="type"/>
        <input type="text" value={type.unit}onChange={handleChange} name="unit"  placeholder="unit"/>
        <input type="number" value={type.size} onChange={handleChange} name="size"  placeholder="size"/>
        <input type="number" value={type.price} onChange={handleChange} name="price"  placeholder="price"/>
        <input type="number" value={type.quantity} onChange={handleChange} name="quantity"  placeholder="quantity"/>
        <button onClick={handleAddType} >Add type</button><br/>

        {
            types? types.map((type) => (
                <div>{type.type} , {type.unit} , {type.size}, {type.price}, {type.quantity}</div>
              )):<h1>list will be added here</h1>
        }
        <br/>


        {/* <input type="text" placeholder="color" />
        <input type="file"  />
        <button  >Add color</button> */}
        <input type="submit" onClick={addProduct}/>

        </div>






        </>
    )
}