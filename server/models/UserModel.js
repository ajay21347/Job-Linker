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
    phone: {
      type: String,
      default: "",
    },
    bio: { type: String, default: "" },
    resume: { type: String, default: "" },
    profilePic: { type: String, default: "" },
    token: { type: String, default: null },
    isLoggedIn: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
