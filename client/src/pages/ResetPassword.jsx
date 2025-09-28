import React, { useState } from "react";
import { Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

function ResetPassword() {
  const { resetPassword, isResettingPassword } = useAuthStore();
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    if (!formData.newPassword.trim() || !formData.confirmPassword.trim()) {
      toast.error("Please fill in all fields");
      return false;
    }
    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Invalid or expired reset link.");
      return;
    }
    if (validateForm()) {
      try {
        await resetPassword(token, formData.newPassword);
        setTimeout(() => navigate("/login"), 3000);
      } catch (error) {
        toast.error(error.message || "Failed to reset password");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-5">
      <div className="flex flex-col justify-center items-center p-4 sm:p-8 lg:p-6 w-full max-w-lg space-y-6 border border-base-300 mt-5 rounded-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mt-1">Reset Password</h1>
          <p className="text-base text-base-content/60">
            Enter a new password to reset your account password.
          </p>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 w-full">
          {/* New Password Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-base">
                New Password
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="size-5 text-base-content/40" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="input input-bordered w-full pl-11 pr-11 h-12 text-base"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-base-content/40"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-base">
                Confirm Password
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="size-5 text-base-content/40" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="input input-bordered w-full pl-11 pr-11 h-12 text-base"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-base-content/40"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full h-12 text-base"
            disabled={isResettingPassword}
          >
            {isResettingPassword ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
        <div className="text-center text-base text-base-content/60 pt-4">
          Back to{" "}
          <Link to="/login" className="text-primary font-medium">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
