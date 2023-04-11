import React, { useEffect, useState } from "react";

import "./ViewOrderScreen.css"
import { useParams} from "react-router-dom";
import axios from "axios";
export default function ViewOrderScreen(){
    const params = useParams()
    // const navigate = useNavigate();
    const [order,setOrder] = useState('')
    const [user,setUser] = useState('')
    const [packed,setPacked]= useState('')
    const [shipped,setShipped] = useState('')
    const [delivered,setDelivered] = useState('')
    const [paid,setPaid] = useState('')
    const id = params.id
    useEffect(()=>{
        const getOrder = async()=>{
            const {data} = await axios.get(`http://localhost:3004/api/order/${id}`)
            if(data.order){
                setOrder(data.order)
                setUser(data.user)
                setPacked(data.order.isPacked)
                setShipped(data.order.isShipped)
                setDelivered(data.order.isDelivered)
                setPaid(data.order.isPaid)
            }else{
    
            }
            }
        getOrder()
    },[id])

const updateOrder = async(name)=>{
    try{
      const email = user.email
        const {data} = await axios.post(`http://localhost:3004/api/order/${id}`,{name,email})
        alert(data.message)
        window.location.reload(true);
    }catch(err){
        console.log(err)
    }
}

    const handlePacked = async()=>{
        updateOrder("packed")
    }
    const handleShipped = async()=>{
        updateOrder("shipped")
    }
    const handlePaid = async()=>{
        updateOrder("paid")
    }
    const handleDelivered = async()=>{
        updateOrder("delivered")
    }



    return(
        <div className="container">
        {/* {console.log(order)} */}
        <h3>Order information</h3>
        {order && 
        <div className=" container row" id={order._id}>
                    <div className="col-sm-5 card">
                      <div className="card-body">
                        <h3>Shipping details</h3>
                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">Order Id :</h6>
                          </div>
                          <div className="col-sm-9 text-secondary">{order.OrderId}</div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">User Email :</h6>
                          </div>
                          <div className="col-sm-9 text-secondary">{user.email}</div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">Full Name</h6>
                          </div>
                          <div className="col-sm-9 text-secondary">
                            {order.shippingDetails[0].FirstName}{" "}
                            {order.shippingDetails[0].LastName}
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">Contact No:</h6>
                          </div>
                          <div className="col-sm-9 text-secondary">
                            {order.shippingDetails[0].PhoneNumber}
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">Address</h6>
                          </div>
                          <div className="col-sm-9 text-secondary">
                            {order.shippingDetails[0].Address} {" ,"}
                            {order.shippingDetails[0].City}
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">Pincode</h6>
                          </div>
                          <div className="col-sm-9 text-secondary">
                            {order.shippingDetails[0].PinCode}
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">State</h6>
                          </div>
                          <div className="col-sm-9 text-secondary">
                            {order.shippingDetails[0].State}
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                            {
                                order.isCanceled ? <div style={{color:"red"}}>Order is Canceled by user</div>: (
                                    <>
                                    
                            <div className="col">
                                {packed ? 
                                <>Order is Packed</>
                                :
                                <button className="btn btn-dark" onClick={handlePacked}>Packed</button>
                            }

                            </div>
                            <div className="col">
                                {shipped ?
                            <>Order is shipped</>
                            :    
                            <button className="btn btn-dark" onClick={handleShipped}>Shipped</button>
                            }
                            </div>
                            <div className="col">
                                {paid ? 
                            <>User Paid</>
                            :
                            <button className="btn btn-dark" onClick={handlePaid}>Paid</button>
                            }
                            </div>

                            <div className="col">
                                {
                                    delivered ?
                                    <>Order Delivered successfully</>
                                    :
                                    <button className="btn btn-dark" onClick={handleDelivered}>Delivered</button>
                                }

                            </div>
                                    </>
                                )
                            }
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-7 card">
                      <div className="card-body">
                        <h3>Product details</h3>
                        <div className="row">
                          {order.Items.map((product) => (
                            <div
                              className="row"
                              key={product.price + product.SelectedSize}
                            >
                              <div className="col-sm">
                                <div className="row">
                                  <img
                                    className="col-sm"
                                    src={product.Image.url}
                                    alt="product-img"
                                    style={{
                                      height: "120px",
                                      objectFit: "contain",
                                    }}
                                  />
                                  <h4
                                    className="col-sm"
                                    style={{ fontSize: "15px" }}
                                    >
                                    {product.ProductName} {product.SelectedSize}{" "}
                                    {product.Types[0].unit}
                                  </h4>
                                  <div className="row"></div>
                                </div>
                              </div>
                              <div className="col-sm">
                                <div className="row">
                                  <h4
                                    className="col-sm"
                                    style={{ textAlign: "center" }}
                                  >
                                    {product.price} * {product.cartQuantity}
                                  </h4>
                                  <h4
                                    className="col-sm"
                                    style={{ textAlign: "center" }}
                                  >
                                    <span>
                                      = {product.price * product.cartQuantity}
                                    </span>
                                  </h4>
                                </div>
                              </div>
                            </div>
                          ))}
                          <hr />
                          <div className="row">
                            <div className="col-sm-9">
                              <h6 className="mb-0">Total Items</h6>
                            </div>
                            <div className="col-sm-3 text-secondary">
                              {order.TotalQuantity}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-sm-9">
                              <h6 className="mb-0">Total Price</h6>
                            </div>
                            <div className="col-sm-3 text-secondary">
                              {order.TotalAmount}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-sm-9">
                              <h6 className="mb-0">Total Point Recived</h6>
                            </div>
                            <div className="col-sm-3 text-secondary">
                              {order.TotalPointsRecived}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-sm-9">
                              <h6 className="mb-0">Total Points Applied</h6>
                            </div>
                            <div className="col-sm-3 text-secondary">
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
    }
        </div>
    )
}