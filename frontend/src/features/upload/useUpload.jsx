import { useState } from "react";
import { api } from "../../services/api";

export const useUpload = () => {
  const [activeTab, setActiveTab] = useState("text");
  const [textContent, setTextContent] = useState("");
  const [file, setFile] = useState(null);

  // New: Advanced Settings State
  const [settings, setSettings] = useState({
    password: "",
    expiry: "10", // Default 10 minutes
    maxViews: "", // Empty = unlimited
    isOneTime: false,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const upload = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();

      // 1. Base Data
      formData.append("type", activeTab);
      if (activeTab === "text") {
        if (!textContent.trim()) throw new Error("Please enter some text.");
        formData.append("content", textContent);
      } else {
        if (!file) throw new Error("Please select a file.");
        formData.append("file", file);
      }

      // 2. Advanced Settings (Bonus Features)
      if (settings.password) formData.append("password", settings.password);
      if (settings.maxViews) formData.append("maxViews", settings.maxViews);
      if (settings.isOneTime) formData.append("isOneTime", "true"); // Checkbox sends string 'true'
      formData.append("expiryDuration", settings.expiry);

      // Note: We use .upload() for both because we are sending FormData now (cleaner)
      const response = await api.upload("/upload", formData);
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setTextContent("");
    setFile(null);
    setError("");
    setSettings({ password: "", expiry: "10", maxViews: "", isOneTime: false });
  };

  return {
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
  };
};
