const mongoose = require("mongoose");

const OtpSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    Otp: {
      type: Number,
      required: true,
      maxLength: 4,
    },
    expireIn: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.code || mongoose.model("code", OtpSchema);
