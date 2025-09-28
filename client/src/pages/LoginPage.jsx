import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Mail, Lock, Eye, EyeOff, Loader2, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn, error } = useAuthStore(); // Include error from the auth store

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      return toast.error("All fields are required");
    }

    if (!formData.email.trim()) {
      return toast.error("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return toast.error("Please enter a valid email address");
    }

    if (!formData.password) {
      return toast.error("Password is required");
    } else if (formData.password.length < 8) {
      return toast.error("Enter Correct Password");
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = validateForm();

    if (success === true) {
      login(formData);
    }
  };
  return (
    <div className="min-h-screen grid lg:grid-cols-2 mt-12">
      {/* Left Side */}
      <div className="flex flex-col justify-center items-center p-4 sm:p-8 lg:p-6">
        <div className="w-full max-w-lg space-y-6">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="flex flex-col items-center gap-3 group">
              <div className="size-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageCircle className="size-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mt-1">Login</h1>
              <p className="text-base text-base-content/60">
                Get Started with your free account
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
                  className={`input input-bordered w-full pl-11 h-12 text-base`}
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
              {/* Error Handling */}
              {error && (
                <label className="label">
                  <span className="label-text-alt text-error">{error}</span>
                </label>
              )}
            </div>
            {/* Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-base">
                  Password
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-11 pr-11 h-12 text-base`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>
            {/* Forgot Password Link */}
            <div className="text-right">
              <Link to="/forgot-password" className="text-primary font-medium">
                Forgot Password?
              </Link>
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full h-12 text-base mt-4"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>
          {/* Login Link */}
          <div className="text-center text-base text-base-content/60 pt-4">
            Already have an account?{" "}
            <Link to="/signup" className="text-primary font-medium">
              Create an account
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - You can add an image or additional content here */}
      <div
        className="hidden lg:block bg-base-200 w-full h-full bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1552068751-34cb5cf055b3?q=80&w=1530&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      >
        {/* Black Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Centered Text */}
        <div className="absolute inset-0 flex place-items-center justify-center">
          <div
            className="rounded-lg bg-gray-500 p-4
            bg-clip-padding backdrop-filter backdrop-blur 
            bg-opacity-10 backdrop-saturate-100 backdrop-contrast-100"
          >
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-l from-indigo-500 via-red-500 to-blue-500 text-transparent bg-clip-text">
              Connectify Messenger
            </h1>
            <p className="text-lg text-white text-center">
              Chat. Share. Connect.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
