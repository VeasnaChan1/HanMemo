import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import InputField from "../components/common/InputField";
import Button from "../components/common/Button";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loggedUser = await login({
        email: formData.email,
        password: formData.password,
      });
      if (loggedUser?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Invalid email or password credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    // Outer canvas matching page background color (#FAFAFA)
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#FAFAFA]">
      {/* Central Modal Container Card using custom gray border (#E8E8F0) */}
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-[#E8E8F0] shadow-sm text-left">
        {/* Header Branding Block */}
        <div className="text-center mb-6">
          <div className="font-bold text-2xl text-[#E8453C] tracking-wide mb-1">
            Han<span className="text-[#1A1A2E]">MEMO</span>
          </div>
          <h2 className="text-xl font-bold text-[#1A1A2E]">Welcome Back</h2>
          <p className="text-sm text-[#4A4A6A]">Start your Chinese Journey</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-[#FFF0EF] text-[#E8453C] border border-red-200 text-sm font-medium rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-1">
          <InputField
            label="Email Address"
            name="email"
            type="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="text-right -mt-2 mb-4">
            <Link
              to="#"
              className="text-sm text-[#4A4A6A] hover:text-[#E8453C] transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-center text-sm text-[#4A4A6A] mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[#E8453C] font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
