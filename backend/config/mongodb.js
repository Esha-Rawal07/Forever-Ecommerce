import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is missing in the backend .env file");
  }

  mongoose.connection.on("connected", () => {
    console.log("DB Connected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err.message);
  });

  const normalizedUri = uri.trim().replace(/\/+$/, "");
  mongoose.set('bufferCommands', false);
  await mongoose.connect(`${normalizedUri}/e-commerce`, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  });
};

export default connectDB;