import React, { useEffect, useState } from 'react';
import './List.css';
import axios from "axios";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import { MdEditSquare } from "react-icons/md";
import EditFoodModal from "../../components/EditFoodModal/EditFoodModal";  // Import the modal component

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    if (response.data.success) {
      setList(response.data.data.reverse());
    } else {
      toast.error("Error");
    }
  };
  

  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
    if (response.data.success) {
      toast.success(response.data.message);
      fetchList();
    } else {
      toast.error("Error");
    }
  };

  const handleEditFood = (food) => {
    setSelectedFood(food);
    setShowModal(true);
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='list add flex-col'>
      <p>All Food List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => (
          <div key={index} className='list-table-format'>
            <img src={`${url}/images/${item.image}`} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>${item.price}</p>
            <p style={{ display: "flex", gap: "10px" }}>
              <p onClick={() => removeFood(item._id)} className='remove cursor'><FaTrash /></p>
              <p onClick={() => handleEditFood(item)} className='edit cursor'><MdEditSquare /></p>
            </p>
          </div>
        ))}
      </div>

      {showModal && <EditFoodModal food={selectedFood} onClose={() => setShowModal(false)} url={url} fetchList={fetchList} />}
    </div>
  );
};

export default List;
