import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import recruiterRoutes from "./routes/recruiterRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/application", applicationRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/interview", interviewRoutes);
app.use("/api/v1/recruiter", recruiterRoutes);

const startServer = async () => {
  try {
    await connectDB(); // connect first

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log("❌ Server failed to start:", error);
  }
};

startServer();
