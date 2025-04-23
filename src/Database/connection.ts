import mongoose from "mongoose";

mongoose.set("debug", true);
mongoose.set("strictQuery", false);

const options = {
  strict: "throw",
  strictQuery: false,
};

export default async function connectDb(): Promise<void> {
  try {
    await mongoose.connect(process.env.URI!, {
      dbName: "exam",
    });
    console.log("Connected to MongoDB");
  } catch (err: any) {
    console.error("MongoDB connection error:", err.message);
    throw err;
  }
}
