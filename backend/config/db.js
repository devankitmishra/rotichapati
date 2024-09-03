import mongoose from "mongoose";

export const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://devankitmishra:ankitmongo@cluster0.dohyo.mongodb.net/food-delivery-app').then(()=>console.log("DB Connected"));
}