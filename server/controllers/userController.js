import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";
import { SendVerificationEmail } from "../utils/sendVerificationEmail.js";
import { sendResetPasswordEmail } from "../utils/sendResetPasswordEmail.js";

//Register
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const normalizedEmail = email.toLowerCase().trim();

    const newUser = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: role === "recruiter" ? "recruiter" : "seeker",
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    newUser.token = token;

    await newUser.save();

    const verificationLink = `${process.env.CLIENT_URL}/verify-email/${token}`;

    await SendVerificationEmail(newUser.email, verificationLink);

    res.status(201).json({
      success: true,
      message: "User registered successfully. Please verify your email.",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        bio: newUser.bio,
        resume: newUser.resume,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User not exists",
      });
    }

    if (!existingUser.isVerified) {
      return res
        .status(401)
        .json({ success: false, message: "Please verify your email first" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid  Credentials" });
    }

    const accessToken = jwt.sign(
      { id: existingUser._id, role: existingUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.status(200).json({
      success: true,
      message: `Welcome back ${existingUser.name}`,
      user: {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
        phone: existingUser.phone,
        bio: existingUser.bio,
        resume: existingUser.resume,
      },
      accessToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Verify Email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        message: "Email already verified",
      });
    }

    user.isVerified = true;

    user.token = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Verification link expired",
    });
  }
};

//Forgot Password

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    user.resetPasswordToken = resetToken;

    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendResetPasswordEmail(user.email, resetLink);

    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your registered gmail.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    const { password } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      user.resetPasswordToken !== token ||
      user.resetPasswordExpires < Date.now()
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired link" });
    }

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Invalid or expired link" });
  }
};

//Update Profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, bio } = req.body;

    if (email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: req.user.id },
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "Email already in use" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        email,
        phone,
        bio,
      },
      { returnDocument: "after" },
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Upload Resume
export const uploadResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const allowedTypes = ["application/pdf"];

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res
        .status(400)
        .json({ success: false, message: "Only PDF resumes  are allowed " });
    }

    const maxSize = 5 * 1024 * 1024;

    if (req.file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: "Resume size must be less than 5MB",
      });
    }

    user.resume = { url: req.file.path, public_id: req.file.filename };

    await user.save();

    res.status(200).json({
      success: true,
      resume: user.resume,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Upload Profile Picture
export const uploadProfilePic = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Only JPG ,PNG and WEBP images are allowed",
      });
    }

    const maxSize = 2 * 1024 * 1024;

    if (req.file.size > maxSize) {
      return res
        .status(400)
        .json({ success: false, message: "Image size must be less than 2MB" });
    }

    // Delete old image if exists
    if (user.profilePic?.public_id) {
      await cloudinary.uploader.destroy(user.profilePic.public_id);
    }

    // Save new image
    user.profilePic = {
      url: req.file.path,
      public_id: req.file.filename,
    };

    await user.save();

    return res.status(200).json({
      success: true,
      profilePic: user.profilePic,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Change Password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Delete Profile Picture
export const deleteProfilePic = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.profilePic?.public_id) {
      await cloudinary.uploader.destroy(user.profilePic.public_id);
    }

    user.profilePic = {
      url: "",
      public_id: "",
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile picture removed successfully",
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message() });
  }
};
