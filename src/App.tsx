import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <BrowserRouter>
      <main className="min-h-screen bg-background text-foreground">
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Routes>
      </main>
      
      {/* Global Toaster Mount */}
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  )
}

export default App