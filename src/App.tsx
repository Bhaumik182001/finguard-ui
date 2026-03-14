import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import LoginPage from "@/pages/auth/LoginPage";

// A simple placeholder for the dashboard until we build Milestone 2
const DashboardPlaceholder = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <h1 className="text-2xl font-semibold text-slate-800">Dashboard (Protected Route)</h1>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPlaceholder />} />
      </Routes>
      
      {/* Global Error/Success Toasts */}
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  );
}

export default App;