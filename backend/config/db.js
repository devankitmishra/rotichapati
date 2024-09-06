import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
    const dbURI = process.env.MONGODB_URI;
  await mongoose
    .connect(dbURI)
    .then(() => console.log("DB Connected"))
    .catch((error) => {
        console.error("DB Connection Error:", error);
        process.exit(1);
      });
};
