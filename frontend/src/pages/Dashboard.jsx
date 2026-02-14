import React from "react";
import {
  FiTrash2,
  FiEye,
  FiClock,
  FiFile,
  FiType,
  FiMoreHorizontal,
} from "react-icons/fi";

const Dashboard = () => {
  // Mock Data for UI Visualization
  const files = [
    {
      id: 1,
      name: "project_specs.pdf",
      type: "file",
      views: 24,
      maxViews: 50,
      expires: "2 hours",
      size: "2.4 MB",
    },
    {
      id: 2,
      name: "Secret API Keys",
      type: "text",
      views: 1,
      maxViews: 1,
      expires: "10 mins",
      size: "Text",
    },
    {
      id: 3,
      name: "Q3_Financials.xlsx",
      type: "file",
      views: 5,
      maxViews: null,
      expires: "6 days",
      size: "14 KB",
    },
  ];

  return (
    <div className="w-full max-w-5xl animate-fade-in">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-main mb-2">Your Vault</h1>
          <p className="text-text-muted">Manage your active secure links.</p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-white border border-border rounded-lg shadow-sm text-center">
            <span className="block text-xs font-bold text-text-muted uppercase">
              Active
            </span>
            <span className="text-xl font-bold text-primary">3</span>
          </div>
          <div className="px-4 py-2 bg-white border border-border rounded-lg shadow-sm text-center">
            <span className="block text-xs font-bold text-text-muted uppercase">
              Total Views
            </span>
            <span className="text-xl font-bold text-text-main">30</span>
          </div>
        </div>
      </div>

      {/* Files Table */}
      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surfaceHighlight/50 border-b border-border/60 text-xs uppercase tracking-wider text-text-muted">
              <th className="px-6 py-4 font-bold">Content</th>
              <th className="px-6 py-4 font-bold">Views</th>
              <th className="px-6 py-4 font-bold">Expires In</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {files.map((file) => (
              <tr
                key={file.id}
                className="hover:bg-surfaceHighlight/30 transition-colors group"
              >
                {/* Content Name */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${file.type === "file" ? "bg-primary/10 text-primary" : "bg-orange-50 text-orange-600"}`}
                    >
                      {file.type === "file" ? (
                        <FiFile className="w-5 h-5" />
                      ) : (
                        <FiType className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-text-main text-sm">
                        {file.name}
                      </p>
                      <p className="text-xs text-text-muted">{file.size}</p>
                    </div>
                  </div>
                </td>

                {/* View Count */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-text-main">
                    <FiEye className="text-text-muted" />
                    {file.views}
                    <span className="text-text-muted text-xs">
                      {file.maxViews ? `/ ${file.maxViews}` : " (Unlimited)"}
                    </span>
                  </div>
                </td>

                {/* Expiry */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-text-muted bg-surfaceHighlight px-2 py-1 rounded-md w-fit">
                    <FiClock className="w-3 h-3" />
                    {file.expires}
                  </div>
                </td>

                {/* Actions (Manual Delete) */}
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-text-muted hover:text-accent hover:bg-accent/5 rounded-lg transition-all group-hover:shadow-sm">
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State Helper */}
        {files.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-muted">No active uploads found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
