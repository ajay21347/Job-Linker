import express from "express";
import {
  changePassword,
  deleteProfilePic,
  forgotPassword,
  getAllUsers,
  login,
  register,
  resetPassword,
  updateProfile,
  uploadProfilePic,
  uploadResume,
  verifyEmail,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";
import { loginLimiter, registerLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/login", loginLimiter, login);
router.post("/register", registerLimiter, register);
router.get("/verify-email/:token", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.put("/profile", protect, updateProfile);
router.get("/all-users", protect, getAllUsers);
router.put("/upload-resume", protect, upload.single("resume"), uploadResume);
router.put(
  "/upload-profile-pic",
  protect,
  upload.single("profilePic"),
  uploadProfilePic,
);
router.delete("/delete-profile-pic", protect, deleteProfilePic);
router.put("/change-password", protect, changePassword);

export default router;
