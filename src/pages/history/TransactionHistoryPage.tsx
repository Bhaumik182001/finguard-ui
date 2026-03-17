import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Activity, ChevronLeft, ChevronRight } from "lucide-react";

import { transactionService } from "@/services/transactionService";
import type { PaginatedTransactions } from "@/types/transaction";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
};

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "Pending...";
  const date = new Date(dateString);
  // Check if the date is actually valid before formatting
  if (isNaN(date.getTime())) return "Processing...";
  
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric', 
    hour: 'numeric', 
    minute: '2-digit' 
  }).format(date);
};

export default function TransactionHistoryPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<PaginatedTransactions | null>(null);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const result = await transactionService.getHistory(page, 10);
        setData(result);
      } catch (error) {
        console.error("Failed to load transactions", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [page]);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Button variant="ghost" className="mb-6 text-slate-500" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>

        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-white pb-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-900" />
              <CardTitle className="text-2xl font-semibold">Transaction History</CardTitle>
            </div>
            <CardDescription>A complete audit trail of your account activity.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 bg-white">
            {isLoading ? (
              <div className="flex justify-center items-center h-48 text-slate-400 animate-pulse">
                Fetching records...
              </div>
            ) : !data || data.content.length === 0 ? (
              <div className="flex justify-center items-center h-48 text-slate-500">
                No transactions found.
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.content.map((txn) => (
                      <TableRow key={txn.id}> 
                        <TableCell className="text-slate-600">
                          {formatDate(txn.createdAt)} 
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-900">{txn.description}</span>
                            <span className="text-xs text-slate-500">
                              {txn.sourceAccountId} → {txn.destinationAccountId}
                            </span>
                          </div>
                        </TableCell>
                        
                        {/* THE NEW COLOR-CODED BADGE LOGIC */}
                        <TableCell>
                          {(txn.status === 'SUCCESS' || txn.status === 'COMPLETED') && (
                            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none">
                              {txn.status}
                            </Badge>
                          )}
                          {txn.status === 'PENDING' && (
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-none">
                              {txn.status}
                            </Badge>
                          )}
                          {txn.status === 'FAILED' && (
                            <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100 border-none">
                              {txn.status}
                            </Badge>
                          )}
                        </TableCell>

                        <TableCell className="text-right font-semibold text-slate-900">
                          {formatCurrency(txn.amount, "USD")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                  <p className="text-sm text-slate-500">
                    Showing Page {data.number + 1} of {data.totalPages}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => p - 1)}
                      disabled={data.first || isLoading}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => p + 1)}
                      disabled={data.last || isLoading}
                    >
                      Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}