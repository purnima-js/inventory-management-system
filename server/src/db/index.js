import mongoose from "mongoose";
import { DB_Name } from "../constant.js";
import { configDotenv } from "dotenv";

configDotenv()

async function connectDB() {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_UR ||"mongodb+srv://cpurnima233:cpurnima233@cluster0.xihcb2c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"}/${DB_Name}`
    );
    console.log("Connected to DB:", connectionInstance.connection.host);
  } catch (error) {
    console.log("Error connecting to DB", error);
  }
}

export default connectDB;
