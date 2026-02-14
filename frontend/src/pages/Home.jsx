import React from "react";
import UploadCard from "../components/UploadCard";
import { FiShield } from "react-icons/fi";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[70vh] gap-10">
      <div className="text-center space-y-6 animate-fade-in max-w-3xl z-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 border border-border/60 shadow-sm text-[10px] font-bold text-primary uppercase tracking-widest backdrop-blur-sm">
          <FiShield /> End-to-End Encrypted
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-text-main tracking-tight leading-[1.1]">
          Share sensitive data <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            securely.
          </span>
        </h1>

        <p className="text-text-muted text-xl font-medium max-w-xl mx-auto leading-relaxed">
          The encrypted vault for ephemeral file sharing. <br />
          No logs. No tracking. Pure privacy.
        </p>
      </div>

      <div className="w-full animate-fade-in z-20">
        <UploadCard />
      </div>
    </div>
  );
};

export default Home;
