import React, { useEffect, useState } from "react";
import {
  FiTrash2,
  FiEye,
  FiClock,
  FiFile,
  FiType,
  FiCopy,
  FiCheck,
  FiFolder,
  FiActivity,
} from "react-icons/fi";
import { useAuth } from "../AuthContext";
import { API_BASE } from "../api";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { token } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  // Tick every minute so expiry countdowns stay current
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchMyFiles();
  }, [token]);

  const fetchMyFiles = async () => {
    try {
      const res = await fetch(`${API_BASE}/files/user/my-files`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setFiles(data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (code) => {
    if (!window.confirm("Delete this file permanently?")) return;
    try {
      const res = await fetch(`${API_BASE}/files/${code}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setFiles(files.filter((f) => f.code !== code));
        toast.success("File deleted successfully");
      }
    } catch {
      toast.error("Error deleting file");
    }
  };

  const copyToClipboard = (code) => {
    const url = `${window.location.origin}/v/${code}`;
    navigator.clipboard.writeText(url);
    setCopiedId(code);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getTimeStatus = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const diffMs = expiry - now;

    if (diffMs <= 0) {
      return { label: "EXPIRED", color: "red", text: "Link invalid" };
    }

    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);

    let timeText = "";
    if (diffDays > 0) timeText = `${diffDays} days left`;
    else if (diffHrs > 0) timeText = `${diffHrs} hours left`;
    else timeText = `${diffMins} mins left`;

    return { label: "ACTIVE", color: "green", text: timeText };
  };

  if (loading)
    return (
      <div className="text-center mt-20 font-bold text-text-muted">
        Loading vault...
      </div>
    );

  return (
    <div className="w-full max-w-6xl animate-fade-in mt-6">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-main mb-2">Your Vault</h1>
          <p className="text-text-muted">Manage your active links.</p>
        </div>

        <div className="flex gap-4">
          <div className="bg-white border border-border/60 rounded-xl px-6 py-3 shadow-sm min-w-[140px]">
            <span className="block text-xs font-bold text-text-muted uppercase mb-1">
              Active Files
            </span>
            <span className="text-2xl font-bold text-primary">
              {files.length}
            </span>
          </div>

          <div className="bg-white border border-border/60 rounded-xl px-6 py-3 shadow-sm min-w-[140px]">
            <span className="block text-xs font-bold text-text-muted uppercase mb-1">
              Total Views
            </span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-text-main">
                {files.reduce((acc, curr) => acc + (curr.view_count || 0), 0)}
              </span>
              <FiActivity className="text-text-muted" />
            </div>
          </div>
        </div>
      </div>

      {/* Files Table */}
      <div className="bg-white border border-border/60 rounded-2xl shadow-grand overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surfaceHighlight/30 border-b border-border/50 text-xs uppercase tracking-wider text-text-muted">
              <th className="px-6 py-4 font-bold">File Name</th>
              <th className="px-6 py-4 font-bold">Views</th>
              <th className="px-6 py-4 font-bold">Expiry Status</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {files.map((file) => {
              const status = getTimeStatus(file.expires_at);

              return (
                <tr
                  key={file.id}
                  className="hover:bg-surfaceHighlight/30 transition-colors"
                >
                  {/* Name Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${file.type === "file" ? "bg-indigo-50 text-primary" : "bg-orange-50 text-orange-600"}`}
                      >
                        {file.type === "file" ? <FiFile /> : <FiType />}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-text-main truncate max-w-[200px]">
                          {file.original_name || "Secure Note"}
                        </p>
                        <p className="text-xs text-text-muted">
                          {file.type === "file"
                            ? `${(file.size_bytes / 1024).toFixed(1)} KB`
                            : "Text"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Views */}
                  <td className="px-6 py-4 text-sm font-medium text-text-main">
                    <div className="flex items-center gap-2">
                      <FiEye className="text-text-muted" />
                      {file.view_count}
                      <span className="text-text-muted text-xs font-normal">
                        {file.max_views ? `/ ${file.max_views}` : ""}
                      </span>
                    </div>
                  </td>

                  {/* Expiry */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-start gap-1">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                          status.label === "EXPIRED"
                            ? "bg-red-50 text-red-600 border-red-100"
                            : "bg-green-50 text-green-600 border-green-100"
                        }`}
                      >
                        {status.label}
                      </span>

                      {/* Time remaining */}
                      <span className="text-xs text-text-muted font-mono flex items-center gap-1">
                        <FiClock className="w-3 h-3" />
                        {status.text}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => copyToClipboard(file.code)}
                        className="p-2 hover:bg-surfaceHighlight rounded-lg text-text-muted hover:text-primary transition-all"
                        title="Copy Link"
                      >
                        {copiedId === file.code ? (
                          <FiCheck className="text-green-500" />
                        ) : (
                          <FiCopy />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(file.code)}
                        className="p-2 hover:bg-red-50 rounded-lg text-text-muted hover:text-red-600 transition-all"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {files.length === 0 && (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-surfaceHighlight rounded-full flex items-center justify-center mx-auto mb-4 text-text-muted">
              <FiFolder className="w-8 h-8" />
            </div>
            <p className="text-text-muted">No active files found.</p>
            <Link
              to="/"
              className="inline-block mt-4 text-primary font-bold hover:underline"
            >
              Upload a file
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
