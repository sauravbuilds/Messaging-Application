import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
    },
    fullName: {
      type: String,
      required: [true, "Fullname is required."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minLength: 8,
    },
    profilePic: {
      type: String,
      default: "",
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
