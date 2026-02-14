import React from "react";
import Navbar from "./Navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-text-main font-sans antialiased relative selection:bg-primary/20 selection:text-primary">
      {/* Dot grid background pattern */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundColor: "#f8fafc",
          backgroundImage: "radial-gradient(#64748b 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
          opacity: 0.15,
        }}
      />

      <Navbar />

      <main className="relative z-10 pt-32 pb-20 px-4 max-w-7xl mx-auto flex flex-col items-center w-full">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
