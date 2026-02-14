import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiArrowRight,
  FiAlertCircle,
} from "react-icons/fi";
import { useAuth } from "../AuthContext";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Validate each field before submit
  const validateForm = () => {
    if (!fullName || fullName.length < 2) {
      setError("Name must be at least 2 characters.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      await register(fullName, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md animate-fade-in mt-10 mx-auto z-20 relative">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-text-main mb-3">
          Create Account
        </h1>
        <p className="text-text-muted">Join LinkVault for advanced controls.</p>
      </div>

      <div className="bg-white border border-border rounded-2xl shadow-grand p-8">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-bold rounded-lg flex items-center gap-2">
            <FiAlertCircle /> {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-muted uppercase ml-1">
              Full Name
            </label>
            <div className="flex items-center bg-background border border-border rounded-xl px-4 py-3 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5 transition-all">
              <FiUser className="text-text-muted w-5 h-5 mr-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="bg-transparent w-full outline-none text-sm font-medium text-text-main"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-muted uppercase ml-1">
              Email
            </label>
            <div className="flex items-center bg-background border border-border rounded-xl px-4 py-3 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5 transition-all">
              <FiMail className="text-text-muted w-5 h-5 mr-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="bg-transparent w-full outline-none text-sm font-medium text-text-main"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-muted uppercase ml-1">
              Password
            </label>
            <div className="flex items-center bg-background border border-border rounded-xl px-4 py-3 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5 transition-all">
              <FiLock className="text-text-muted w-5 h-5 mr-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent w-full outline-none text-sm font-medium text-text-main"
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
          >
            {loading ? "Creating Account..." : "Get Started"}
            {!loading && (
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            )}
          </button>
        </form>
      </div>

      <p className="text-center mt-8 text-sm text-text-muted">
        Already have an account?{" "}
        <Link to="/login" className="text-primary font-bold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;
