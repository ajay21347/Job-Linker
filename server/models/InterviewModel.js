import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    questions: [String],
    answers: [String],
    currentQuestionIndex: {
      type: Number,
      default: 0,
    },
    completed: { type: Boolean, default: false },
    title: { type: String },
    duration: { type: Number, default: 0 },
    transcript: [
      {
        role: String,
        content: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;
