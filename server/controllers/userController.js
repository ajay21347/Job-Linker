import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    // verifyEmail(token, email);

    await User.updateOne({ _id: newUser._id }, { token });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: newUser._id,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User not exists",
      });
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

    // if (existingUser.isVerified === false) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Verify your account, then login" });
    // }

    const accessToken = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "10d",
      },
    );

    // const refreshToken = jwt.sign(
    //   { id: existingUser._id },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "30d" },
    // );

    existingUser.isLoggedIn = true;
    await existingUser.save();

    // const exisitingSession = await sessionStorage.findOne({
    //   userId: existingUser._id,
    // });
    // if (exisitingSession) {
    //   await sessionStorage.deleteOne({ userId: existingUser._id });
    // // }

    // await sessionStorage.create({ userId: existingUser._id });

    res.status(200).json({
      success: true,
      message: `Welcome back ${existingUser.name}`,
      user: {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
      accessToken,
      // refreshToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
