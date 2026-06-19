import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import InputField from "../components/common/InputField";
import Button from "../components/common/Button";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("All fields are required.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const mockToken = "mock-jwt-token-from-register";
      const mockUserData = {
        id: 2,
        name: formData.fullName,
        email: formData.email,
        role: "learner",
      };

      login(mockToken, mockUserData);
      navigate("/level-selection");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong during registration.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    // Outer layout canvas using light gray background
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#FAFAFA]">
      {/* Central Card Wrapper with visible gray border layout line */}
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-[#E8E8F0] shadow-sm text-left">
        <div className="text-center mb-6">
          {/* Brand Logo Header using primary brand red */}
          <div className="font-bold text-2xl text-[#E8453C] tracking-wide mb-1">
            Han<span className="text-[#E8453C]">MEMO</span>
          </div>
          <h2 className="text-xl font-bold text-[#1A1A2E]">Create Account</h2>
          <p className="text-sm text-[#4A4A6A]">Start your Chinese Journey</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-[#FFF0EF] text-[#E8453C] border border-red-200 text-sm font-medium rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-1">
          <InputField
            label="Full Name"
            type="text"
            name="fullName"
            placeholder="Enter your name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <InputField
            label="Email Address"
            type="email"
            name="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <InputField
            label="Password"
            type="password"
            name="password"
            placeholder="Create new password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <InputField
            label="Confirm password"
            type="password"
            name="confirmPassword"
            placeholder="Enter your password again"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="mt-2"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-[#4A4A6A] mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#E8453C] font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
