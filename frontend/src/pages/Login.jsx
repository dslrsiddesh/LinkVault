import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiArrowRight, FiAlertCircle } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md animate-fade-in mt-10 mx-auto z-20 relative">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-text-main mb-3">
          Welcome back.
        </h1>
        <p className="text-text-muted">Sign in to manage your secure vault.</p>
      </div>

      <div className="bg-white border border-border rounded-2xl shadow-grand p-8">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-bold rounded-lg flex items-center gap-2">
            <FiAlertCircle /> {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
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
            {loading ? "Signing In..." : "Sign In"}
            {!loading && (
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            )}
          </button>
        </form>
      </div>

      <p className="text-center mt-8 text-sm text-text-muted">
        Don't have an account?{" "}
        <Link to="/register" className="text-primary font-bold hover:underline">
          Create free account
        </Link>
      </p>
    </div>
  );
};

export default Login;
