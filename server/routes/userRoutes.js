import express from "express";
import {
  getAllUsers,
  login,
  register,
  updateProfile,
  uploadResume,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/login", login);

router.post("/register", register);
router.put("/profile", protect, updateProfile);
router.get("/all-users", protect, getAllUsers);
router.put("/upload-resume", protect, upload.single("resume"), uploadResume);

export default router;
