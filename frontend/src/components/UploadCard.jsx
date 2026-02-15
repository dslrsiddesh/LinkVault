import { useState, useEffect } from "react";
import {
  FiUploadCloud,
  FiFileText,
  FiLock,
  FiClock,
  FiActivity,
  FiCheck,
  FiZap,
} from "react-icons/fi";
import toast from "react-hot-toast";
import useUpload from "../hooks/useUpload";

const UploadCard = () => {
  const {
    activeTab,
    setActiveTab,
    file,
    handleFileSelect,
    textContent,
    setTextContent,
    settings,
    setSettings,
    loading,
    error,
    result,
    upload,
    resetUpload,
  } = useUpload();

  const [copied, setCopied] = useState(false);

  // Show toast when an upload error occurs
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const copyLink = () => {
    if (!result?.uniqueCode) return;
    navigator.clipboard.writeText(
      `${window.location.origin}/v/${result.uniqueCode}`,
    );
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleBurn = () => {
    const burning = !settings.isOneTime;
    setSettings({
      ...settings,
      isOneTime: burning,
      maxViews: burning ? "1" : "",
    });
  };

  const onFileSelect = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.size > 100 * 1024 * 1024) {
      toast.error("File too large (Max 100MB)");
    }
    handleFileSelect(e);
  };

  // Success view after upload
  if (result) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white border border-border rounded-2xl shadow-grand overflow-hidden transition-all animate-fade-in relative z-20">
        <div className="p-10 text-center animate-fade-in">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <FiCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-text-main mb-2">
            Transfer Secured.
          </h2>
          <p className="text-text-muted mb-8">
            Your secure link is ready to share.
          </p>

          <div className="flex items-center gap-2 bg-surfaceHighlight p-2 rounded-xl border border-border/60 mb-8">
            <div className="flex-1 bg-white border border-border rounded-lg px-4 py-3 text-sm font-mono text-text-muted truncate select-all">
              {window.location.origin}/v/{result.uniqueCode}
            </div>
            <button
              onClick={copyLink}
              className={`px-6 py-3 rounded-lg font-bold text-white transition-all shadow-md ${
                copied
                  ? "bg-green-500 shadow-green-200"
                  : "bg-primary hover:bg-primary-hover shadow-primary/20"
              }`}
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
          <button
            onClick={resetUpload}
            className="text-sm font-bold text-text-muted hover:text-text-main underline decoration-2 decoration-transparent hover:decoration-primary transition-all"
          >
            Send another file
          </button>
        </div>
      </div>
    );
  }

  // Upload form view
  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-border rounded-2xl shadow-grand overflow-hidden transition-all animate-fade-in relative z-20">
      {/* Tab switcher */}
      <div className="flex border-b border-border/50">
        <button
          onClick={() => setActiveTab("text")}
          className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === "text" ? "text-primary bg-primary/5 border-b-2 border-primary" : "text-text-muted hover:bg-surfaceHighlight"}`}
        >
          <FiFileText /> Text / Code
        </button>
        <button
          onClick={() => setActiveTab("file")}
          className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === "file" ? "text-primary bg-primary/5 border-b-2 border-primary" : "text-text-muted hover:bg-surfaceHighlight"}`}
        >
          <FiUploadCloud /> File Upload
        </button>
      </div>

      <div className="p-8">
        {/* Content input area */}
        <div className="mb-8 min-h-[160px]">
          {activeTab === "text" ? (
            <textarea
              className="w-full h-40 p-4 bg-background border border-border rounded-xl resize-none focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-mono text-sm"
              placeholder="Paste your sensitive text, passwords, or code snippets here..."
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
            />
          ) : (
            <div className="relative w-full h-40 border-2 border-dashed border-border rounded-xl bg-background hover:bg-surfaceHighlight/50 transition-colors group flex flex-col items-center justify-center text-center cursor-pointer">
              <input
                type="file"
                onChange={onFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {file ? (
                <div className="z-0 animate-fade-in">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-3">
                    <FiFileText className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-text-main">{file.name}</p>
                  <p className="text-xs text-text-muted mt-1">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="group-hover:scale-105 transition-transform duration-300">
                  <div className="w-12 h-12 bg-surfaceHighlight rounded-full flex items-center justify-center mx-auto mb-3">
                    <FiUploadCloud className="w-6 h-6 text-text-muted group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-sm font-bold text-text-main">
                    Click to browse or drag file
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    Max 100MB &middot; Auto-encrypted
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Settings grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase ml-1">
                Expires In
              </label>
              <div className="relative">
                <FiClock className="absolute left-3 top-3 text-text-muted w-4 h-4" />
                <select
                  value={settings.expiry}
                  onChange={(e) =>
                    setSettings({ ...settings, expiry: e.target.value })
                  }
                  className="w-full pl-9 pr-3 py-2.5 bg-background border border-border rounded-xl text-sm font-medium focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none appearance-none"
                >
                  <option value="5">5 Minutes</option>
                  <option value="10">10 Minutes</option>
                  <option value="60">1 Hour</option>
                  <option value="1440">1 Day</option>
                  <option value="10080">7 Days</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase ml-1">
                Password (Optional)
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-text-muted w-4 h-4" />
                <input
                  type="password"
                  placeholder="Set protection..."
                  value={settings.password}
                  onChange={(e) =>
                    setSettings({ ...settings, password: e.target.value })
                  }
                  className="w-full pl-9 pr-3 py-2.5 bg-background border border-border rounded-xl text-sm font-medium focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
                />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase ml-1">
                Max Downloads
              </label>
              <div className="relative">
                <FiActivity className="absolute left-3 top-3 text-text-muted w-4 h-4" />
                <input
                  type="number"
                  placeholder="Unlimited"
                  value={settings.maxViews}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      maxViews: e.target.value,
                      isOneTime: e.target.value === "1",
                    })
                  }
                  className="w-full pl-9 pr-3 py-2.5 bg-background border border-border rounded-xl text-sm font-medium focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase ml-1">
                Destruction
              </label>
              <div
                onClick={toggleBurn}
                className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all h-[42px] ${settings.isOneTime ? "bg-rose-50 border-rose-200 shadow-sm" : "bg-background border-border hover:bg-surfaceHighlight"}`}
              >
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${settings.isOneTime ? "bg-rose-500 text-white" : "bg-border/20 text-text-muted"}`}
                >
                  <FiZap className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <span
                    className={`text-xs font-bold ${settings.isOneTime ? "text-rose-700" : "text-text-main"}`}
                  >
                    Burn after reading
                  </span>
                  {settings.isOneTime && (
                    <FiCheck className="text-rose-600 w-4 h-4 mr-1" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={upload}
          disabled={loading}
          className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Encrypting & Uploading..." : "Create Secure Link"}
        </button>
      </div>
    </div>
  );
};

export default UploadCard;
