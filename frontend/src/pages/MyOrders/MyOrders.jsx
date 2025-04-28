import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/assets";
import Loader from "../../components/Loader/Loader";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const mode = localStorage.getItem("mode");

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      setData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const requestCancellation = async (orderId) => {
    try {
      setLoading(true);
      const response = await axios.post(url + "/api/order/status", {
        orderId,
        status: "Cancellation Requested"
      });

      if (response.data.success) {
        await fetchOrders(); // refresh after request
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) {
      setLoading(true);
      const timer = setTimeout(() => {
        fetchOrders();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [token]);

  return (
    <div className="my-orders">
      <h2 className="myordersp">My Orders</h2>
  
      {loading && <Loader />} {/* 👈 move loader here */}
  
      {!loading && (  // only show orders if NOT loading
        <div className="container">
          {data.reverse().map((order, index) => {
            const canCancel = order.status === "Food Processing";
  
            return (
              <div className="my-orders-order" key={index}>
                <img
                  src={
                    order.items.length === 1
                      ? `${url}/images/${order.items[0].image}`
                      : assets.parcel_icon
                  }
                  alt={order.items.length === 1 ? order.items[0].name : "Parcel"}
                />
                <p>
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return item.name + " X " + item.quantity;
                    } else {
                      return item.name + " X " + item.quantity + ", ";
                    }
                  })}
                </p>
                <p style={{display:"flex", alignItems:"center", justifyContent:"center"}}>${order.amount}.00</p>
                <p className="item-count">Items: {order.items.length}</p>
                <p>
                  <span
                    style={{
                      color:
                        order.status === "Delivered"
                          ? "green"
                          : order.status === "Canceled"
                          ? "red"
                          : "orange",
                    }}
                  >
                    &#x25cf;
                  </span>
                  <b> {order.status}</b>
                </p>
  
                <button 
                  onClick={() => requestCancellation(order._id)}
                  disabled={!canCancel}
                  style={{
                    color: canCancel ? (mode === "dark" ? "white" : "black") : "#888",
                    border: `2px solid ${canCancel ? "#ff6347" : "transparent"}`,
                    cursor: canCancel ? "pointer" : "not-allowed",
                    boxShadow: canCancel ? "0px 4px 8px rgba(255,99,71,0.5)" : "none",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    transition: "0.3s"
                  }}
                  
                >
                  Request Cancellation
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
  
};

export default MyOrders;
