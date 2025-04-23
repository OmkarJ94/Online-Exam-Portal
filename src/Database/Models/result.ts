import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  questionList: { type: Array, required: true },
  examId: { type: String, required: true },
  score: { type: Number, required: true },
  startTime: { type: String, required: true },
  submissionTime: { type: String, required: true },
  selectedAnswers: { type: Array, required: true },
  userId: { type: String, required: true },
  videoUrl: { type: String, required: false },
});

export default mongoose.models.result || mongoose.model("result", resultSchema);
