import React, { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

function ForgotPassword() {
  const { sendForgotPasswordEmail, isSendingForgotPasswordEmail } =
    useAuthStore();
  const [formData, setFormData] = useState({ email: "" });

  const validateForm = () => {
    if (!formData.email.trim()) {
      toast.error("Please enter your email address");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      await sendForgotPasswordEmail(formData.email);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-5">
      <div className="flex flex-col justify-center items-center p-4 sm:p-8 lg:p-6 w-full max-w-lg space-y-6 border border-base-300 mt-5 rounded-xl">
        {/* Logo */}
        <div className="text-center mb-6 ">
          <div className="flex flex-col items-center gap-3 group">
            <h1 className="text-3xl font-bold mt-1">Forgot Password</h1>
            <p className="text-base text-base-content/60">
              Enter your registered email to receive password reset link.
            </p>
          </div>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-base">Email</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="size-5 text-base-content/40" />
              </div>
              <input
                type="email"
                className="input input-bordered w-full pl-11 h-12 text-base"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ email: e.target.value })}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full h-12 text-base"
            disabled={isSendingForgotPasswordEmail}
          >
            {isSendingForgotPasswordEmail ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
        <div className="text-center text-base text-base-content/60 pt-4">
          Remembered your password?{" "}
          <Link to="/login" className="text-primary font-medium">
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
