import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

export default function ProtectedRoute() {
  // We check our Zustand global state to see if they have a valid session
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    // If not logged in, kick them back to login and replace the history state
    // so they can't click the "Back" button to bypass this.
    return <Navigate to="/login" replace />;
  }

  // If they are authenticated, render the child routes (e.g., the Dashboard)
  return <Outlet />;
}