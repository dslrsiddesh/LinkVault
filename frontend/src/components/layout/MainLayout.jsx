import React from "react";
import Navbar from "./Navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-text-main font-sans antialiased selection:bg-primary/20 selection:text-primary relative">
      {/* 1. Grand Gradient Mesh (Subtle top glow) */}
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none z-0" />

      <Navbar />

      <main className="relative z-10 pt-32 pb-16 px-4 max-w-7xl mx-auto flex flex-col items-center">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
