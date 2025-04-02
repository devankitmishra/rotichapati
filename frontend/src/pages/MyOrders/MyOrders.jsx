import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/assets";
import Loader from "../../components/Loader/Loader";
import url from "../../context/StoreContext";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    const response = await axios.post(
      url + "/api/order/userorders",
      {},
      { headers: { token } }
    );
    setData(response.data.data);
    console.log(response.data.data);
    setLoading(false);
  };

  useEffect(() => {
    if (token) {
      setLoading(true);

      const timer = setTimeout(() => {
        fetchOrders(setLoading);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [token]);

  return (
    <div className="my-orders">
      <h2 className="myordersp">My Orders</h2>
      <div className="container">
        {data.reverse().map((order, index) => {
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
              <p>${order.amount}.00</p>
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

              <button onClick={fetchOrders}>Track Order</button>
            </div>
          );
        })}
      </div>

      {loading && <Loader />}
    </div>
  );
};

export default MyOrders;
