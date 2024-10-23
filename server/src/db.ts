import mongoose from "mongoose";

/* const MONGO_URI = "mongodb://localhost:27017/digiProject"; */
const MONGO_URI =
  "mongodb+srv://marcosgalliano03:AC1TsGVa59w3SO4I@cluster0.waxns.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
