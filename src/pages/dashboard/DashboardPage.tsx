import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { accountService } from "@/services/accountService";
import { useAuthStore } from "@/store/useAuthStore";
import type { Account } from "@/types/account";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, CreditCard, Building } from "lucide-react";

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-blue-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building className="h-6 w-6" />
            <span className="text-xl font-bold tracking-tight">FinGuard</span>
          </div>
          <Button 
            variant="ghost" 
            className="text-white hover:bg-blue-800 hover:text-white"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-900">Accounts Summary</h1>
          <p className="text-slate-500 mt-1">View and manage your active accounts.</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-pulse text-slate-400">Loading accounts...</div>
          </div>
        ) : accounts.length === 0 ? (
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center h-40 text-slate-500">
              <CreditCard className="h-8 w-8 mb-2 opacity-50" />
              <p>No accounts found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => (
              <Card key={account.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500 flex justify-between items-center">
                    <span>Account Number</span>
                    <CreditCard className="h-4 w-4 text-slate-400" />
                  </CardTitle>
                  <p className="text-lg font-semibold text-slate-900">{account.accountNumber}</p>
                </CardHeader>
                <CardContent>
                  <div className="mt-4">
                    <p className="text-sm text-slate-500">Available Balance</p>
                    <p className="text-3xl font-bold text-blue-900 mt-1">
                      {formatCurrency(account.balance, account.currency)}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                    <Button 
                      variant="outline" 
                      className="border-blue-900 text-blue-900 hover:bg-blue-50"
                      onClick={() => navigate('/transfer')}
                    >
                      Transfer Funds
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}