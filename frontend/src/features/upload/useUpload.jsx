import { useState } from "react";

const useUpload = () => {
  // 1. STATE MANAGEMENT
  const [activeTab, setActiveTab] = useState("text"); // 'text' | 'file'
  const [file, setFile] = useState(null);
  const [textContent, setTextContent] = useState("");

  // Settings State
  const [settings, setSettings] = useState({
    password: "",
    expiry: "10", // Default 10 minutes
    maxViews: "",
    isOneTime: false,
  });

  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null); // Stores the success response (code, link)

  // 2. FILE VALIDATION LOGIC
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];

    // Reset errors when selecting a new file
    setError(null);

    if (!selectedFile) return;

    // VALIDATION: Check File Size (100MB Limit)
    // 100 * 1024 * 1024 bytes = 104,857,600 bytes
    const MAX_SIZE = 100 * 1024 * 1024;

    if (selectedFile.size > MAX_SIZE) {
      setError("File is too large. Maximum size is 100MB.");
      setFile(null); // Clear the invalid file
      e.target.value = null; // Reset the input field
      return;
    }

    // VALIDATION: Optional Type Check (Commented out to allow all types)
    // const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'text/plain'];
    // if (!allowedTypes.includes(selectedFile.type)) {
    //   setError("Invalid file type. Only PDF, Images, and Text files allowed.");
    //   setFile(null);
    //   return;
    // }

    setFile(selectedFile);
  };

  // 3. UPLOAD LOGIC
  const upload = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();

      // Append Basic Data
      formData.append("type", activeTab);
      formData.append("expiry", settings.expiry);
      formData.append("isOneTime", settings.isOneTime);

      // Append Optional Data
      if (settings.password) formData.append("password", settings.password);
      if (settings.maxViews) formData.append("maxViews", settings.maxViews);

      // Append Content based on Type
      if (activeTab === "text") {
        if (!textContent.trim())
          throw new Error("Please enter some text content.");
        formData.append("content", textContent);
      } else {
        if (!file) throw new Error("Please select a file to upload.");
        formData.append("file", file);
      }

      // 4. AUTHENTICATION (Get Token)
      const token = localStorage.getItem("token");
      const headers = {};

      // If user is logged in, attach token so the upload is linked to their account
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // 5. API CALL
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        headers: headers, // Send Auth Headers
        body: formData, // Send Multipart Form Data
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed. Please try again.");
      }

      // 6. SUCCESS
      setResult(data);

      // Clear sensitive inputs after success
      setFile(null);
      setTextContent("");
      setSettings((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      console.error("Upload Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper to reset the form completely
  const resetUpload = () => {
    setFile(null);
    setTextContent("");
    setSettings({
      password: "",
      expiry: "10",
      maxViews: "",
      isOneTime: false,
    });
    setResult(null);
    setError(null);
  };

  return {
    activeTab,
    setActiveTab,
    file,
    setFile,
    handleFileSelect, // Export the validation handler
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
