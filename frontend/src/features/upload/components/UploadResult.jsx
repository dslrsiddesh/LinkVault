import React, { useState } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";

const UploadResult = ({ uniqueCode, onReset }) => {
  const [copied, setCopied] = useState(false);
  const link = `${window.location.origin}/v/${uniqueCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in text-center">
      <div className="p-6 bg-background/50 border border-primary/30 rounded-xl mb-6">
        <p className="text-primary font-bold uppercase tracking-widest text-xs mb-3">
          Secure Link Generated
        </p>

        <div className="flex items-center gap-2 bg-surfaceHighlight p-1 rounded-lg border border-border">
          <input
            readOnly
            value={link}
            className="flex-1 bg-transparent text-text-main font-mono text-sm px-3 focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="p-2 bg-surface hover:bg-primary hover:text-white rounded-md text-text-muted transition-all"
          >
            {copied ? (
              <FiCheck className="w-5 h-5" />
            ) : (
              <FiCopy className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <button
        onClick={onReset}
        className="text-text-muted hover:text-primary text-sm font-medium transition-colors"
      >
        Upload Another Item
      </button>
    </div>
  );
};

export default UploadResult;
