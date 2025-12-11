import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.DB_URI || "");

    if (connection) {
      console.log(`Connected successfully to database ${connection.connection.host}`);
    }
  } catch (error) {
    console.log(`Error occurred durning login to database: `, error);
  }
};

export default connectDb;
