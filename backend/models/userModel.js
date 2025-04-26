import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    type: { 
        type: String,
        enum: ["admin", "customer", "deliveryPartner", "itemManager"], 
        default: "customer" 
    },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} }
}, { minimize: false });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
