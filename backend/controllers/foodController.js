import foodModel from "../models/foodModel.js";
import fs from "fs";

//add food item

const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`;

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });
  try {
    await food.save();
    res.json({ success: true, message: "food added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// all food list
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// remove food item
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, () => {});

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// search food items
const searchFood = async (req, res) => {
  const { query } = req.query;

  try {
    const results = await foodModel.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    });

    res.json({ success: true, data: results });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Search failed" });
  }
};

// update food items
const updateFood = async (req, res) => {
  try {
    const { id, name, description, price, category } = req.body;
    let updatedData = { name, description, price, category };

    if (req.file) {
      const food = await foodModel.findById(id);
      if (food.image) {
        fs.unlink(`uploads/${food.image}`, (err) => {
          if (err) console.log("Error deleting old image:", err);
        });
      }
      updatedData.image = req.file.filename;
    }

    const updatedFood = await foodModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedFood) {
      return res.json({ success: false, message: "Food item not found" });
    }

    res.json({ success: true, message: "Food updated", data: updatedFood });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating food item" });
  }
};

export { addFood, listFood, removeFood, searchFood, updateFood };
