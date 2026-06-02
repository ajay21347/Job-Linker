import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["seeker", "recruiter", "admin"],
      default: "seeker",
    },
    phone: { type: String, default: "" },
    bio: { type: String, default: "" },
    resume: { url: String, public_id: String },
    profilePic: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
    token: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
