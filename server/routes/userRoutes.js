import express from "express";
import {
  getAllUsers,
  login,
  register,
  updateProfile,
  uploadProfilePic,
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
router.put(
  "/upload-profile-pic",
  protect,
  upload.single("profilePic"),
  uploadProfilePic,
);

export default router;
