import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  FiDownload,
  FiLock,
  FiAlertCircle,
  FiFileText,
  FiShield,
  FiArrowRight,
} from "react-icons/fi";

const ViewPage = () => {
  const { code } = useParams();
  // Mock State: Change to 'password', 'success', or 'error' to test UI
  const [status, setStatus] = useState("password");
  const [password, setPassword] = useState("");

  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center animate-fade-in">
      {/* 1. Password Locked State */}
      {status === "password" && (
        <div className="w-full max-w-md bg-white border border-border rounded-2xl shadow-grand p-10 text-center">
          <div className="w-16 h-16 bg-surfaceHighlight rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <FiLock className="w-8 h-8 text-primary" />
          </div>

          <h2 className="text-2xl font-bold text-text-main mb-2">
            Restricted Access
          </h2>
          <p className="text-text-muted text-sm mb-8">
            This content is password protected by the sender.
          </p>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setStatus("success");
            }}
          >
            <div className="text-left space-y-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider ml-1">
                Password
              </label>
              <input
                type="password"
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-inner"
                placeholder="Enter access code..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
              Unlock Content <FiArrowRight />
            </button>
          </form>
        </div>
      )}

      {/* 2. Success/Download State */}
      {status === "success" && (
        <div className="w-full max-w-2xl bg-white border border-border rounded-2xl shadow-grand overflow-hidden">
          {/* Header */}
          <div className="bg-surfaceHighlight/30 border-b border-border/50 px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-widest">
              <FiShield className="text-green-500" /> End-to-End Encrypted
            </div>
            <div className="text-xs font-mono text-text-muted bg-white border border-border px-2 py-1 rounded">
              ID: {code || "Xy9z1A"}
            </div>
          </div>

          <div className="p-10 text-center">
            {/* File Icon */}
            <div className="w-20 h-20 bg-primary/5 border border-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <FiFileText className="w-10 h-10 text-primary" />
            </div>

            <h2 className="text-3xl font-bold text-text-main mb-2">
              Project_Specs_Final.pdf
            </h2>
            <p className="text-text-muted mb-10">
              2.4 MB • Uploaded 10 mins ago
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button className="px-8 py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-hover hover:shadow-primary/40 transition-all flex items-center justify-center gap-2">
                <FiDownload className="w-5 h-5" /> Download File
              </button>
              <button className="px-8 py-3.5 bg-white border border-border text-text-main font-bold rounded-xl hover:bg-surfaceHighlight transition-all">
                Preview
              </button>
            </div>
          </div>

          <div className="bg-background border-t border-border/60 p-4 text-center">
            <p className="text-xs text-text-muted">
              This link will expire automatically.{" "}
              <a href="/" className="text-primary hover:underline font-bold">
                Create your own
              </a>
            </p>
          </div>
        </div>
      )}

      {/* 3. Error State */}
      {status === "error" && (
        <div className="text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiAlertCircle className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-3xl font-bold text-text-main mb-3">
            Link Expired
          </h1>
          <p className="text-text-muted max-w-md mx-auto mb-8">
            This secure link is no longer active. It may have reached its view
            limit or the time limit has passed.
          </p>
          <a
            href="/"
            className="px-8 py-3 bg-white border border-border shadow-sm rounded-full font-bold text-text-main hover:border-primary hover:text-primary transition-all"
          >
            Back to Home
          </a>
        </div>
      )}
    </div>
  );
};

export default ViewPage;
