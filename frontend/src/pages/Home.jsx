import React from "react";
import MainLayout from "../components/layout/MainLayout";
import UploadCard from "../features/upload/uploadCard";

const Home = () => {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center w-full min-h-[80vh] gap-10">
        {/* Hero Section */}
        <div className="text-center space-y-4 animate-fade-in max-w-2xl">
          <div className="inline-block border border-border bg-white px-3 py-1 rounded-full text-[10px] font-bold text-primary uppercase tracking-widest shadow-sm mb-2">
            Professional Encryption Standard
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-text-main tracking-tight leading-tight">
            Ephemeral data <br />
            <span className="text-text-muted">secure delivery.</span>
          </h1>

          <p className="text-text-muted text-lg font-medium max-w-lg mx-auto">
            The secure vault for sharing sensitive files. <br />
            No tracking. No logs. Pure privacy.
          </p>
        </div>

        {/* The Card */}
        <div className="w-full animate-fade-in z-20">
          <UploadCard />
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
