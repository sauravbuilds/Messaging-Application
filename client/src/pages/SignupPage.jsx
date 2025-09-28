import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName || !formData.email || !formData.password) {
      return toast.error("All fields are required");
    }

    if (!formData.fullName.trim()) {
      return toast.error("Full Name is required");
    }

    if (!formData.email.trim()) {
      return toast.error("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return toast.error("Please enter a valid email address");
    }

    if (!formData.password) {
      return toast.error("Password is required");
    } else if (formData.password.length < 8) {
      return toast.error("Password must be at least 8 characters long");
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = validateForm();

    if (success === true) {
      signup(formData);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 mt-12">
      {/* Left Side */}
      <div className="flex flex-col justify-center items-center p-4 sm:p-8 lg:p-6">
        <div className="w-full max-w-lg space-y-6">
          {" "}
          {/* Changed from max-w-md to max-w-lg */}
          {/* Logo */}
          <div className="text-center mb-6">
            {" "}
            {/* Reduced margin-bottom */}
            <div className="flex flex-col items-center gap-3 group">
              <div className="size-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                {" "}
                {/* Increased from size-12 to size-16 */}
                <MessageCircle className="size-8 text-primary" />{" "}
                {/* Increased from size-6 to size-8 */}
              </div>
              <h1 className="text-3xl font-bold mt-1">Create Account</h1>{" "}
              {/* Increased from text-2xl to text-3xl */}
              <p className="text-base text-base-content/60">
                {" "}
                {/* Added text-base for explicit size */}
                Get Started with your free account
              </p>
            </div>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {" "}
            {/* Adjusted spacing */}
            {/* Full Name Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-base">
                  Full Name
                </span>{" "}
                {/* Added text-base */}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-11 h-12 text-base ${
                    errors.fullName ? "input-error" : ""
                  }`}
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
              {errors.fullName && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.fullName}
                  </span>
                </label>
              )}
            </div>
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
                  className={`input input-bordered w-full pl-11 h-12 text-base ${
                    errors.email ? "input-error" : ""
                  }`}
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.email}
                  </span>
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
                  className={`input input-bordered w-full pl-11 pr-11 h-12 text-base ${
                    errors.password ? "input-error" : ""
                  }`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
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
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.password}
                  </span>
                </label>
              )}
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full h-12 text-base mt-4" // Increased height and added margin-top
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
            {/* Submit Error */}
            {errors.submit && (
              <div className="text-error text-center text-sm">
                {errors.submit}
              </div>
            )}
          </form>
          {/* Login Link */}
          <div className="text-center text-base text-base-content/60 pt-4">
            {" "}
            {/* Added padding-top */}
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium">
              Log in
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

export default SignupPage;
