import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import transporter from "../lib/nodemailer.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "Email already exists.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // Generate JWT Token
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
        createdAt: newUser.createdAt,
        message: "User created Successfully.",
      });
    } else {
      res.status(400).json({
        message: "Invalid user data",
      });
    }
  } catch (error) {
    console.log("Error in Signup Controller", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found. Please sign up first." });
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid credentials. Please try again." });
    }

    // Generate JWT Token
    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      createdAt: user.createdAt,
      message: "Login successful.",
    });
  } catch (error) {
    console.log("Error in Login Controller", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const logout = (req, res) => {
  try {
    // Clear the JWT token cookie
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    console.log("Error in Logout Controller", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required." });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    console.log("Error in Update Profile Controller", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in Check Auth Controller", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const forgotPasswordSendEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found." });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const FRONTEND_URL =
      process.env.NODE_ENV === "production"
        ? "https://messaging-application-socket-io.onrender.com"
        : process.env.FRONTEND_URL;

    const link = `${FRONTEND_URL}/reset-password/${token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Password Reset Link",
      html: `
         <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); text-align: center;">
    <div style="margin-bottom: 20px;">
      <img src="https://res.cloudinary.com/rohitcloudinary/image/upload/v1738185380/rvefpficmvv8bjcjffac.png" alt="Company Logo" style="max-width: 150px; margin: auto; display: block;">
      <h2 style="font-size: 18px; color: #333; margin-top: 10px;">Connectify Messenger</h2>
    </div>
    <h1 style="font-size: 22px; color: #333;">Password Reset Request</h1>
    <p style="font-size: 16px; color: #555;">You have requested to reset your password. Click the button below to proceed.</p>
    <a href="${link}" style="display: inline-block; background: #007bff; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">Reset Password</a>
    <p style="margin-top: 20px; font-size: 14px; color: #888;">If you did not request this, please ignore this email.</p>
    <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
    <p style="font-size: 12px; color: #888;">&copy; 2025 Connectify Messenger. All rights reserved.</p>
    <p style="font-size: 12px; color: #888;">Need help? <a href="https://x.com/rohitVish_1717" style="color: #007bff;">Contact Support</a></p>
  </div>
</div>


      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Password reset link sent successfully.",
    });
  } catch (error) {
    console.log(
      "Error in Forgot Password Send Email Controller",
      error.message
    );
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Token and password required." });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid or expired token." });
      }

      const user = await User.findById(decoded._id);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await User.findByIdAndUpdate(decoded._id, { password: hashedPassword });

      res.status(200).json({ message: "Password reset successfully." });
    });
  } catch (error) {
    console.log("Error in Reset Password Controller", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
