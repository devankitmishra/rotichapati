import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./EditFoodModal.css";

const EditFoodModal = ({ food, onClose, url, fetchList }) => {
  const [editedFood, setEditedFood] = useState({ ...food });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(food.image ? `${url}/images/${food.image}` : null);

  const handleChange = (e) => {
    setEditedFood({ ...editedFood, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Show preview before uploading
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id", editedFood._id);
    formData.append("name", editedFood.name);
    formData.append("description", editedFood.description);
    formData.append("category", editedFood.category);
    formData.append("price", editedFood.price);
    if (image) formData.append("image", image); // Only append if new image is selected

    try {
      const response = await axios.post(`${url}/api/food/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.success) {
        toast.success("Food updated successfully!");
        fetchList();
        onClose();
      } else {
        toast.error("Error updating food item");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update food");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Edit Food Item</h3>
        <form onSubmit={handleSubmit}>
          
          <label>Image</label>
          <div style={{display:"flex", gap:"20px" , marginTop:"5px", marginBottom:"10px"}}>

          {preview && <img style={{ height:"50px", border:"1px solid tomato"}} src={preview} alt="Preview" className="image-preview" />}
          <input  type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <label>Item Name</label>
          <input type="text" name="name" value={editedFood.name} onChange={handleChange} required />


          <label>Description</label>
          <textarea name="description" value={editedFood.description} onChange={handleChange} required />

          <div style={{ display: "flex", gap: "20px" }}>
            <div>
              <label>Category</label>
              <select name="category" value={editedFood.category} onChange={handleChange}>
                <option value="Salad">Salad</option>
                <option value="Rolls">Rolls</option>
                <option value="Desert">Desert</option>
                <option value="Sandwich">Sandwich</option>
                <option value="Cake">Cake</option>
                <option value="Pure Veg">Pure Veg</option>
                <option value="Pasta">Pasta</option>
                <option value="Noodles">Noodles</option>
                <option value="Biryani">Biryani</option>
                <option value="Bread">Bread</option>
              </select>
            </div>

            <div>
              <label>Price</label>
              <input type="number" name="price" value={editedFood.price} onChange={handleChange} required />
            </div>
          </div>

          

          <div className="modal-actions">
            <button type="submit">Update</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFoodModal;
