import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiDownload,
  FiLock,
  FiAlertCircle,
  FiFileText,
  FiShield,
  FiArrowRight,
  FiCopy,
  FiCheck,
} from "react-icons/fi";

const ViewPage = () => {
  const { code } = useParams();
  const [status, setStatus] = useState("loading"); // loading | password | success | error
  const [data, setData] = useState(null);
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  // Prevent double-fetching in React Strict Mode
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchFile();
  }, [code]);

  const fetchFile = async (pwd = null) => {
    try {
      const method = pwd ? "POST" : "GET";
      const headers = pwd ? { "Content-Type": "application/json" } : {};
      const body = pwd ? JSON.stringify({ password: pwd }) : null;

      const res = await fetch(`http://localhost:5000/api/files/${code}`, {
        method,
        headers,
        body,
      });

      const result = await res.json();

      if (res.status === 200) {
        if (result.type === "file") {
          result.downloadUrl = `/api/files/${code}/download`;
        }
        setData(result);
        setStatus("success");
      } else if (res.status === 401 || res.status === 403) {
        setStatus("password");
        if (pwd) setErrorMsg(result.error || "Incorrect password");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    hasFetched.current = false;
    hasFetched.current = true;
    fetchFile(password);
  };

  const handleDownload = () => {
    if (data?.downloadUrl) {
      window.location.href = `http://localhost:5000${data.downloadUrl}`;
    }
  };

  const handleCopyText = () => {
    if (data?.content) {
      navigator.clipboard.writeText(data.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 🔴 SAFE SIZE CALCULATION
  const getFileSize = () => {
    if (!data) return "0.00";
    // Check all possible field names from DB/API to prevent NaN
    const bytes = data.size_bytes || data.fileSize || data.size || 0;
    return (bytes / 1024).toFixed(2);
  };

  // 🔴 SAFE NAME & TYPE
  const getFileName = () =>
    data?.original_name || data?.originalName || "Secure File";
  const getMimeType = () =>
    data?.mime_type || data?.mimeType || "application/octet-stream";

  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center animate-fade-in px-4">
      {/* 1. Loading State */}
      {status === "loading" && (
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-surfaceHighlight rounded-full mb-4 shadow-sm"></div>
          <div className="h-4 w-32 bg-surfaceHighlight rounded"></div>
        </div>
      )}

      {/* 2. Password Locked State */}
      {status === "password" && (
        <div className="w-full max-w-md bg-white border border-border rounded-2xl shadow-grand p-10 text-center relative z-10">
          <div className="w-16 h-16 bg-surfaceHighlight rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <FiLock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-text-main mb-2">
            Restricted Access
          </h2>
          <p className="text-text-muted text-sm mb-6">
            This content is password protected.
          </p>
          <form className="space-y-4" onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              autoFocus
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-inner"
              placeholder="Enter access code..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errorMsg && (
              <p className="text-xs text-red-500 font-bold bg-red-50 p-2 rounded-lg border border-red-100 flex items-center justify-center gap-2">
                <FiAlertCircle /> {errorMsg}
              </p>
            )}
            <button className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2">
              Unlock Content <FiArrowRight />
            </button>
          </form>
        </div>
      )}

      {/* 3. Success State */}
      {status === "success" && data && (
        <div className="w-full max-w-3xl bg-white border border-border rounded-2xl shadow-grand overflow-hidden relative z-10">
          <div className="bg-surfaceHighlight/30 border-b border-border/50 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-widest">
              <FiShield className="text-green-500 w-4 h-4" /> End-to-End
              Encrypted
            </div>
            <div className="text-xs font-mono text-text-muted bg-white border border-border px-3 py-1.5 rounded-lg shadow-sm">
              ID: <span className="text-text-main font-bold">{code}</span>
            </div>
          </div>

          <div className="p-8 sm:p-10 text-center">
            {data.type === "text" ? (
              <div className="w-full text-left">
                <div className="flex items-center justify-between mb-4 pl-1">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <FiFileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-text-main">
                        Secure Note
                      </h3>
                      <p className="text-[10px] text-text-muted">
                        {data.content?.length || 0} characters
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyText}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold border rounded-lg transition-all ${
                      copied
                        ? "bg-green-50 text-green-600 border-green-200"
                        : "bg-white text-text-main border-border hover:border-primary hover:text-primary"
                    }`}
                  >
                    {copied ? (
                      <FiCheck className="w-3.5 h-3.5" />
                    ) : (
                      <FiCopy className="w-3.5 h-3.5" />
                    )}
                    {copied ? "Copied" : "Copy Text"}
                  </button>
                </div>
                <div className="bg-background p-6 rounded-xl border border-border font-mono text-sm text-text-main whitespace-pre-wrap shadow-inner max-h-[60vh] overflow-y-auto selection:bg-primary/20">
                  {data.content}
                </div>
              </div>
            ) : (
              <div className="py-8">
                <div className="w-24 h-24 bg-surfaceHighlight rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-border">
                  <FiFileText className="w-10 h-10 text-primary" />
                </div>
                {/* SAFE Name Handling */}
                <h2 className="text-2xl sm:text-3xl font-bold text-text-main mb-2 break-all px-4">
                  {getFileName()}
                </h2>
                {/* SAFE Size Handling */}
                <p className="text-text-muted mb-10 text-sm font-medium">
                  {getFileSize()} KB • {getMimeType()}
                </p>

                <button
                  onClick={handleDownload}
                  className="px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 mx-auto w-full sm:w-auto min-w-[200px]"
                >
                  <FiDownload className="w-5 h-5" /> Download File
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Error State */}
      {status === "error" && (
        <div className="text-center p-8 max-w-lg bg-white border border-border rounded-2xl shadow-grand">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-red-100">
            <FiAlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-text-main mb-3">
            Link Expired
          </h1>
          <p className="text-text-muted mb-8 leading-relaxed">
            This secure link is no longer active. It may have reached its view
            limit or the time has expired.
          </p>
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-white border border-border shadow-sm rounded-xl font-bold text-text-main hover:border-primary hover:text-primary hover:bg-surfaceHighlight transition-all"
          >
            Back to Home
          </Link>
        </div>
      )}
    </div>
  );
};

export default ViewPage;
