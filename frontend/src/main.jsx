import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // <--- MUST BE HERE
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {" "}
      {/* 1. Router wraps everything */}
      <AuthProvider>
        {" "}
        {/* 2. Auth wraps the App */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
