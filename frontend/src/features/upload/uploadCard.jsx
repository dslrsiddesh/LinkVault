import React, { useState, useEffect } from "react";
import {
  FiFile,
  FiType,
  FiSettings,
  FiLock,
  FiClock,
  FiEye,
  FiActivity,
  FiX,
  FiUploadCloud,
} from "react-icons/fi";
import { useUpload } from "./useUpload";
import UploadResult from "./components/UploadResult";

const UploadCard = () => {
  const {
    activeTab,
    setActiveTab,
    textContent,
    setTextContent,
    file,
    setFile,
    settings,
    updateSetting,
    loading,
    result,
    error,
    upload,
    reset,
  } = useUpload();

  const [showSettings, setShowSettings] = useState(false);

  // Sync Logic
  useEffect(() => {
    if (settings.isOneTime) updateSetting("maxViews", "1");
  }, [settings.isOneTime]);

  if (result) {
    return (
      <div className="w-full max-w-xl mx-auto bg-surface border border-border/60 rounded-2xl shadow-grand p-10 animate-fade-in text-center">
        <UploadResult uniqueCode={result.uniqueCode} onReset={reset} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-surface border border-border/60 rounded-2xl shadow-grand transition-all duration-300 overflow-hidden">
      {/* 1. Header & Tabs */}
      <div className="px-8 py-6 border-b border-border/50 bg-surfaceHighlight/30 flex items-center justify-between">
        <span className="text-xs font-bold text-text-muted uppercase tracking-widest">
          Configure Upload
        </span>

        <div className="flex bg-white border border-border rounded-lg p-1 shadow-sm">
          {["text", "file"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-2 capitalize ${
                activeTab === tab
                  ? "bg-primary text-white shadow-md"
                  : "text-text-muted hover:text-text-main hover:bg-surfaceHighlight"
              }`}
            >
              {tab === "text" ? <FiType /> : <FiFile />}
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* 2. Main Input */}
        {activeTab === "text" ? (
          <div className="relative">
            <textarea
              className="w-full h-48 bg-white border border-border rounded-xl p-5 text-text-main font-mono text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all resize-none shadow-inner"
              placeholder="Paste sensitive content here..."
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
            />
            <div className="absolute bottom-4 right-4 text-[10px] font-bold text-text-muted bg-surfaceHighlight px-2 py-1 rounded border border-border">
              {textContent.length} chars
            </div>
          </div>
        ) : (
          <label className="w-full h-48 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center bg-surfaceHighlight/20 hover:bg-white hover:border-primary/50 cursor-pointer transition-all group relative overflow-hidden">
            <input
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />

            {file ? (
              <div className="text-center p-4 relative z-10">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-primary">
                  <FiFile className="w-6 h-6" />
                </div>
                <p className="text-text-main font-bold text-sm truncate max-w-[200px]">
                  {file.name}
                </p>
                <p className="text-text-muted text-xs mt-1">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setFile(null);
                  }}
                  className="mt-3 text-xs text-accent hover:text-accent-hover font-bold flex items-center justify-center gap-1 bg-accent-light px-3 py-1 rounded-full transition-colors"
                >
                  <FiX className="w-3 h-3" /> Remove
                </button>
              </div>
            ) : (
              <div className="text-center group-hover:-translate-y-1 transition-transform">
                <FiUploadCloud className="w-10 h-10 text-text-muted group-hover:text-primary mx-auto mb-3 transition-colors" />
                <p className="text-text-main font-bold text-sm">Upload File</p>
              </div>
            )}
          </label>
        )}

        {/* 3. Settings (Expanded & Robust) */}
        <div className="border border-border/60 rounded-xl overflow-hidden bg-white shadow-sm">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-full flex items-center justify-between px-6 py-4 bg-surfaceHighlight/20 hover:bg-surfaceHighlight/50 transition-colors text-left"
          >
            <span className="flex items-center gap-2 text-sm font-bold text-text-muted hover:text-primary transition-colors">
              <FiSettings
                className={`w-4 h-4 transition-transform duration-300 ${showSettings ? "rotate-90" : ""}`}
              />
              Security Options
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded border ${showSettings ? "bg-primary text-white border-primary" : "bg-white border-border text-text-muted"}`}
            >
              {showSettings ? "ACTIVE" : "DEFAULT"}
            </span>
          </button>

          {showSettings && (
            <div className="p-6 border-t border-border/60 bg-white animate-fade-in space-y-4">
              {/* Grid for Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Password */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-muted uppercase">
                    Password
                  </label>
                  <div className="flex items-center bg-background border border-border rounded-lg px-3 py-2.5 focus-within:border-primary transition-all">
                    <FiLock className="text-text-muted w-4 h-4 mr-2" />
                    <input
                      type="password"
                      placeholder="Optional"
                      className="bg-transparent w-full text-xs text-text-main font-medium focus:outline-none"
                      value={settings.password}
                      onChange={(e) =>
                        updateSetting("password", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* 2. Expiry */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-muted uppercase">
                    Expires In
                  </label>
                  <div className="flex items-center bg-background border border-border rounded-lg px-3 py-2.5 focus-within:border-primary transition-all">
                    <FiClock className="text-text-muted w-4 h-4 mr-2" />
                    <select
                      className="bg-transparent w-full text-xs text-text-main font-medium focus:outline-none cursor-pointer"
                      value={settings.expiry}
                      onChange={(e) => updateSetting("expiry", e.target.value)}
                    >
                      <option value="10">10 Minutes</option>
                      <option value="60">1 Hour</option>
                      <option value="1440">1 Day</option>
                      <option value="10080">1 Week</option>
                    </select>
                  </div>
                </div>

                {/* 3. Max Views (RESTORED!) */}
                <div
                  className={`space-y-1 transition-opacity ${settings.isOneTime ? "opacity-50" : "opacity-100"}`}
                >
                  <label className="text-[10px] font-bold text-text-muted uppercase">
                    Max Views
                  </label>
                  <div className="flex items-center bg-background border border-border rounded-lg px-3 py-2.5 focus-within:border-primary transition-all">
                    <FiEye className="text-text-muted w-4 h-4 mr-2" />
                    <input
                      type="number"
                      min="1"
                      placeholder="Unlimited"
                      className="bg-transparent w-full text-xs text-text-main font-medium focus:outline-none disabled:cursor-not-allowed"
                      value={settings.maxViews}
                      onChange={(e) =>
                        updateSetting("maxViews", e.target.value)
                      }
                      disabled={settings.isOneTime}
                    />
                  </div>
                </div>

                {/* 4. Burn After Read (Rose Accent) */}
                <div
                  onClick={() =>
                    updateSetting("isOneTime", !settings.isOneTime)
                  }
                  className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-all ${
                    settings.isOneTime
                      ? "bg-accent/5 border-accent shadow-sm"
                      : "bg-background border-border hover:border-text-muted"
                  }`}
                >
                  <div className="pl-1">
                    <span
                      className={`text-xs font-bold block ${settings.isOneTime ? "text-accent" : "text-text-main"}`}
                    >
                      Burn after read
                    </span>
                    <span className="text-[10px] text-text-muted">
                      Delete after 1 view
                    </span>
                  </div>

                  <div
                    className={`w-9 h-5 rounded-full relative transition-colors ${settings.isOneTime ? "bg-accent" : "bg-slate-300"}`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${settings.isOneTime ? "translate-x-4" : "translate-x-0"}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="text-xs font-bold text-accent bg-accent-light/50 px-4 py-3 rounded-lg border border-accent/20 text-center">
            {error}
          </div>
        )}

        {/* Action Button (Indigo) */}
        <button
          onClick={upload}
          disabled={loading}
          className={`w-full py-4 rounded-xl font-bold text-sm shadow-lg hover:shadow-grand-hover transition-all active:scale-[0.99] flex items-center justify-center gap-2 ${
            loading
              ? "bg-surfaceHighlight text-text-muted border border-border cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary-hover"
          }`}
        >
          {loading ? "Securing Data..." : "Generate Secure Link"}
          {!loading && <FiLock className="w-4 h-4 opacity-70" />}
        </button>
      </div>
    </div>
  );
};

export default UploadCard;
