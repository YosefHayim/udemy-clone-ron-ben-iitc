import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.DB_URI || "");

    if (connection) {
    }
  } catch (error) {
  }
};

export default connectDb;
