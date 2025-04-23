// /Database/Models/Exam.ts
import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    questions: { type: Number, required: true },
    category: { type: String, required: true },
    status: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
    },
  },
  { timestamps: true }
);

export default mongoose.models.topic || mongoose.model("topic", topicSchema);
