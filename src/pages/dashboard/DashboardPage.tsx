import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { accountService } from "@/services/accountService";
import { useAuthStore } from "@/store/useAuthStore";
import type { Account } from "@/types/account";
import { ArrowRightLeft, CreditCard, Clock, TrendingUp, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await accountService.getMyAccounts();
        setAccounts(data);
      } catch (error) {
        console.error("Failed to fetch accounts", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date());

  return (
    <div className="max-w-[1200px] mx-auto py-8 px-8">
      
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-normal text-[#0a1930] tracking-tight">
            Welcome back{user ? `, ${user.first_name}` : ''}
          </h1>
          <p className="text-sm text-slate-500 mt-1">Portfolio overview as of {formattedDate}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            className="bg-[#0a1930] hover:bg-[#112240] text-white font-medium h-10 px-5 shadow-sm rounded-none"
            onClick={() => navigate('/transfer')}
          >
            <ArrowRightLeft className="mr-2 h-[18px] w-[18px]" />
            Transfer Funds
          </Button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-stretch h-full min-h-[260px]">
        {/* Total Balance Card */}
        <div className="lg:col-span-2 bg-white rounded-none shadow-sm border border-slate-200 p-8 flex flex-col justify-center relative overflow-hidden bg-gradient-to-br from-white to-slate-100">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-slate-200/50 rounded-none -z-10 -mr-[100px] -mt-[100px] pointer-events-none"></div>
          
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">
              Total Deposit Accounts Balance
            </h3>
            <button 
              onClick={() => setShowBalance(!showBalance)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label={showBalance ? "Hide balance" : "Show balance"}
            >
              {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-5xl font-light text-[#0a1930] tracking-tight mb-8">
            {showBalance ? formatCurrency(totalBalance, "USD") : "••••••"}
          </p>
          
          <div>
            <span className="inline-flex items-center px-3 py-1.5 rounded-none bg-[#e8f5ed] text-[#0d7a46] text-sm font-medium border border-[#bce2cc]">
              <TrendingUp className="mr-2 h-4 w-4" /> 
              Available for immediate withdrawal
            </span>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-[#020817] rounded-none shadow-sm border border-[#112240] p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Quick Actions</h3>
            <div className="space-y-1">
              <button 
                onClick={() => navigate('/transfer')}
                className="w-full flex items-center justify-between py-4 border-b border-slate-800 text-white hover:bg-white/5 transition-colors group px-2 -mx-2 rounded-none"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-900/40 p-2 rounded-none text-blue-400 group-hover:text-blue-300 transition-colors">
                    <ArrowRightLeft className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-[15px]">Internal Transfer</span>
                </div>
                <span className="text-blue-500 text-lg font-light">+</span>
              </button>
              
              <button 
                onClick={() => navigate('/history')}
                className="w-full flex items-center justify-between py-4 border-b border-slate-800 text-white hover:bg-white/5 transition-colors group px-2 -mx-2 rounded-none"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-900/40 p-2 rounded-none text-blue-400 group-hover:text-blue-300 transition-colors">
                    <Clock className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-[15px]">View Recent Activity</span>
                </div>
                <span className="text-blue-500 text-lg font-light">+</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Depository Accounts Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-1 lg:col-span-2 bg-white rounded-none shadow-sm border border-slate-200 p-12 text-center text-slate-400">
            Loading accounts...
          </div>
        ) : accounts.length === 0 ? (
          <div className="col-span-1 lg:col-span-2 bg-white rounded-none shadow-sm border border-slate-200 p-12 text-center text-slate-400">
            No accounts found
          </div>
        ) : (
          accounts.map((account) => (
            <div key={account.id} className="bg-white rounded-none shadow-sm border border-slate-200 flex flex-col justify-between group hover:border-slate-300 transition-colors">
              <div className="p-6 md:p-8 flex justify-between items-start border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-slate-50 rounded-none flex items-center justify-center text-[#0a1930] border border-slate-200 shadow-sm">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0a1930] text-lg">
                      {account.accountNumber.startsWith('SAV') ? 'Savings Account' : 'Checking Account'}
                    </h3>
                    <p className="text-sm text-slate-500 font-mono mt-1">
                      Account ending in •••• {account.accountNumber.slice(-4)}
                    </p>
                  </div>
                </div>
                <div className="bg-[#e8f5ed] text-[#0d7a46] px-3 py-1 text-xs font-bold border border-[#bce2cc] rounded-none uppercase tracking-wider">
                  Active
                </div>
              </div>
              <div className="p-6 md:p-8 bg-slate-100 flex flex-col gap-5">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Available Balance</span>
                  <span className="font-bold text-[#0a1930] text-2xl">
                    {showBalance ? formatCurrency(account.balance, account.currency) : "••••••"}
                  </span>
                </div>
                <div className="pt-5 border-t border-slate-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Primary Currency</span>
                    <span className="text-sm font-bold text-[#0a1930] bg-slate-200/50 px-2 py-1 rounded-none border border-slate-300">{account.currency}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Account Number</span>
                    <span className="text-xs font-mono text-[#0a1930] bg-slate-200/50 px-2 py-1 rounded-none border border-slate-300">{account.accountNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reference ID</span>
                    <span className="text-xs font-mono text-slate-500 truncate max-w-[120px] sm:max-w-[200px]" title={account.id}>{account.id}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}