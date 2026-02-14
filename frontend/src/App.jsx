import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register"; // <--- This file must exist
import Dashboard from "./pages/Dashboard"; // <--- This file must exist
import ViewPage from "./pages/ViewPage"; // <--- This file must exist

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/v/:code" element={<ViewPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
