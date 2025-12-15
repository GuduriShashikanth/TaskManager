import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("MONGO_URI environment variable is not defined");
    process.exit(1);
  }

  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
    });

    await mongoose.connect(mongoUri);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected gracefully");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
  }
};
