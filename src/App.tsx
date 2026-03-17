import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import LoginPage from "@/pages/auth/LoginPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import TransferPage from "@/pages/transfers/TransferPage"; 
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import TransactionHistoryPage from "@/pages/history/TransactionHistoryPage";
import RegisterPage from "@/pages/auth/RegisterPage";

// New imports for the Global Layout and 404 Error Page
import MainLayout from "@/components/layout/MainLayout";
import NotFoundPage from "@/pages/error/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Wrap all application routes inside the MainLayout */}
        <Route element={<MainLayout />}>
          
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes (Requires JWT) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/transfer" element={<TransferPage />} /> 
            <Route path="/history" element={<TransactionHistoryPage />} />
          </Route>

          {/* 404 Catch-All Route - Catches any URL not defined above */}
          <Route path="*" element={<NotFoundPage />} />

        </Route>
      </Routes>
      
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  );
}

export default App;