import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
  videoUrl: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: String,
    required: true,
  },
  examId: {
    type: String,
    required: true,
  },
});

const Video = mongoose.model("Video", VideoSchema);

export default Video;
