import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import LoginPage from "@/pages/auth/LoginPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import TransferPage from "@/pages/transfers/TransferPage"; // <-- Import the new page
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import TransactionHistoryPage from "@/pages/history/TransactionHistoryPage";
import RegisterPage from "@/pages/auth/RegisterPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transfer" element={<TransferPage />} /> 
          <Route path="/history" element={<TransactionHistoryPage />} />
        </Route>
      </Routes>
      
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  );
}

export default App;