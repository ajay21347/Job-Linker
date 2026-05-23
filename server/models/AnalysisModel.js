import mongoose, { mongo } from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: { type: String, enum: ["resume", "job-match"] },
    atsScore: Number,
    analysis: String,
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Analysis", analysisSchema);
