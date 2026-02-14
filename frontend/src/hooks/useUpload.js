import { useState } from "react";
import { API_BASE } from "../api";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

const useUpload = () => {
  const [activeTab, setActiveTab] = useState("text");
  const [file, setFile] = useState(null);
  const [textContent, setTextContent] = useState("");
  const [settings, setSettings] = useState({
    password: "",
    expiry: "10",
    maxViews: "",
    isOneTime: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    setError(null);

    if (!selected) return;

    if (selected.size > MAX_FILE_SIZE) {
      setError("File is too large. Maximum size is 100MB.");
      setFile(null);
      e.target.value = null;
      return;
    }

    setFile(selected);
  };

  const upload = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("type", activeTab);
      formData.append("expiry", settings.expiry);
      formData.append("isOneTime", settings.isOneTime);

      if (settings.password) formData.append("password", settings.password);
      if (settings.maxViews) formData.append("maxViews", settings.maxViews);

      if (activeTab === "text") {
        if (!textContent.trim())
          throw new Error("Please enter some text content.");
        formData.append("content", textContent);
      } else {
        if (!file) throw new Error("Please select a file to upload.");
        formData.append("file", file);
      }

      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        headers,
        body: formData,
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Upload failed. Please try again.");

      setResult(data);
      setFile(null);
      setTextContent("");
      setSettings((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setTextContent("");
    setSettings({ password: "", expiry: "10", maxViews: "", isOneTime: false });
    setResult(null);
    setError(null);
  };

  return {
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
  };
};

export default useUpload;
