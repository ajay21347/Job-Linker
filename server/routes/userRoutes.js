import express from "express";
import {
  login,
  register,
  updateProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);

router.post("/register", register);
router.put("/profile", protect, updateProfile);

export default router;
