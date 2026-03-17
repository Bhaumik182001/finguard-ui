import { Outlet, Link, useLocation } from "react-router-dom";
import { Building, ShieldCheck, UserCircle, LogOut, LayoutGrid, Send, Clock, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";

export default function MainLayout() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname.includes('/transfer')) return 'Transfers & Payments';
    if (location.pathname.includes('/history')) return 'Transaction History';
    return 'Overview';
  };

  // Unauthenticated layout (Login / Register) without header or footer
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-100 font-sans">
        <main className="flex-grow flex flex-col">
          <Outlet />
        </main>
      </div>
    );
  }

  // Authenticated layout matches the dark-blue left sidebar reference
  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-[280px] bg-white border-r border-slate-200 flex flex-col flex-shrink-0 z-20 shadow-sm">
        {/* Logo Area */}
        <div className="h-[80px] flex items-center px-8 border-b border-slate-100 flex-shrink-0">
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#0a1930] rounded flex items-center justify-center">
              <Building className="text-white h-4 w-4" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#0a1930]">FinGuard</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 flex flex-col gap-1 px-4 overflow-y-auto">
          <Link 
            to="/dashboard" 
            className={`flex items-center justify-between px-4 py-3 rounded text-sm font-semibold transition-colors ${location.pathname === '/dashboard' || location.pathname === '/' ? 'bg-slate-100/80 text-[#0a1930] border-l-[3px] border-[#0a1930]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-[3px] border-transparent'}`}
          >
            <div className="flex items-center gap-3">
              <LayoutGrid className="h-[18px] w-[18px]" /> Overview
            </div>
            {location.pathname === '/dashboard' && <ChevronRight className="h-4 w-4 text-slate-400" />}
          </Link>

          <Link 
            to="/transfer" 
            className={`flex items-center justify-between px-4 py-3 rounded text-sm font-semibold transition-colors ${location.pathname.includes('/transfer') ? 'bg-slate-100/80 text-[#0a1930] border-l-[3px] border-[#0a1930]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-[3px] border-transparent'}`}
          >
            <div className="flex items-center gap-3">
              <Send className="h-[18px] w-[18px]" /> Transfers & Payments
            </div>
            {location.pathname.includes('/transfer') && <ChevronRight className="h-4 w-4 text-slate-400" />}
          </Link>

          <Link 
            to="/history" 
            className={`flex items-center justify-between px-4 py-3 rounded text-sm font-semibold transition-colors ${location.pathname.includes('/history') ? 'bg-slate-100/80 text-[#0a1930] border-l-[3px] border-[#0a1930]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-[3px] border-transparent'}`}
          >
            <div className="flex items-center gap-3">
              <Clock className="h-[18px] w-[18px]" /> Transaction History
            </div>
            {location.pathname.includes('/history') && <ChevronRight className="h-4 w-4 text-slate-400" />}
          </Link>
        </nav>

        {/* Footer Area */}
        <div className="p-6 border-t border-slate-100 flex flex-col gap-4 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-slate-100 flex items-center justify-center text-slate-500">
              <UserCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Last Login: Today</p>
            </div>
          </div>
          <button onClick={() => authService.logout()} className="flex items-center gap-2 text-rose-600 hover:text-rose-700 text-sm font-semibold mt-2 transition-colors">
            <LogOut className="h-[18px] w-[18px]" />
            <span className="underline decoration-transparent hover:decoration-rose-600 underline-offset-4 transition-all">Secure Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden w-full relative z-10 bg-slate-100">
        {/* Topbar inside Main */}
        <header className="h-[80px] border-b border-slate-200 bg-white flex items-center justify-between px-8 z-10 flex-shrink-0">
          <h1 className="text-xl font-bold text-[#0a1930]">{getPageTitle()}</h1>
          <div className="flex items-center text-emerald-700 bg-white px-4 py-1.5 rounded border border-emerald-200 text-sm font-medium shadow-sm">
            <ShieldCheck className="h-4 w-4 mr-2 text-emerald-600" />
            Secure Session
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}