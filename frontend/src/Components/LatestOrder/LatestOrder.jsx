import React from "react"

export default function LatestOrder(Order){
    const orders = Order

    return(
        <>
        <h2>latest orders</h2>
        <div className="container">
           { orders?.map((or)=>(
            <div className="row">
                {or._id}
            </div>
            ))
           }

        </div>

        </>
    )
}