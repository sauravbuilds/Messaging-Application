import express from "express";
import {
  checkAuth,
  forgotPasswordSendEmail,
  login,
  logout,
  resetPassword,
  signup,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", protectedRoute, updateProfile);
router.get("/check", protectedRoute, checkAuth);
router.post("/send-forgot-password-email", forgotPasswordSendEmail);
router.put("/reset-password/:token", resetPassword);

export default router;
