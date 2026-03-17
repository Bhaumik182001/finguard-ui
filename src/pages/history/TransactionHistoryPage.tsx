import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Activity, ChevronLeft, ChevronRight, FileText, RefreshCw } from "lucide-react";

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
  if (isNaN(date.getTime())) return "Processing...";
  
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: '2-digit', 
    year: 'numeric', 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true
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

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <Button variant="ghost" className="text-slate-500 hover:text-slate-900 w-fit rounded-none" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
          <div className="flex space-x-3">
            <Button variant="outline" className="border-slate-300 text-slate-700 bg-white rounded-none" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
          </div>
        </div>

        <Card className="border-slate-200 shadow-md rounded-none overflow-hidden bg-white">
          <div className="h-2 w-full bg-[#0a1930]"></div>
          <CardHeader className="border-b border-slate-100 pb-6 pt-8 px-8">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-slate-100 rounded-none flex items-center justify-center">
                <Activity className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Transaction History</CardTitle>
                <CardDescription className="text-slate-500 mt-1">A complete audit trail of your account activity.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center h-64 text-slate-400 space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
                <p>Loading transactions...</p>
              </div>
            ) : !data || data.content.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-64 text-slate-500 space-y-3">
                <FileText className="h-12 w-12 text-slate-300" />
                <p className="text-lg">No transactions found.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table className="w-full">
                    <TableHeader className="bg-slate-100 border-b border-slate-300">
                      <TableRow className="hover:bg-slate-100">
                        <TableHead className="py-4 px-6 text-slate-700 font-bold uppercase text-xs tracking-wider">Date & Time</TableHead>
                        <TableHead className="py-4 px-6 text-slate-700 font-bold uppercase text-xs tracking-wider">Description</TableHead>
                        <TableHead className="py-4 px-6 text-slate-700 font-bold uppercase text-xs tracking-wider">Reference</TableHead>
                        <TableHead className="py-4 px-6 text-slate-700 font-bold uppercase text-xs tracking-wider">Status</TableHead>
                        <TableHead className="py-4 px-6 text-right text-slate-700 font-bold uppercase text-xs tracking-wider">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...data.content].reverse().map((txn) => (
                        <TableRow key={txn.id} className="hover:bg-slate-50 transition-colors border-b border-slate-200 group"> 
                          <TableCell className="py-4 px-6 text-slate-700 whitespace-nowrap font-medium">
                            {formatDate(txn.createdAt)} 
                          </TableCell>
                          <TableCell className="py-4 px-6">
                            <span className="text-sm font-bold text-[#0a1930]">{txn.description || txn.type}</span>
                          </TableCell>
                          <TableCell className="py-4 px-6">
                            <div className="flex flex-col">
                              <span className="text-xs text-slate-600 font-mono bg-slate-200/50 border border-slate-300 px-2 py-1 rounded-none w-fit">
                                {txn.sourceAccountId} → {txn.destinationAccountId}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 px-6">
                            {(txn.status === 'SUCCESS' || txn.status === 'COMPLETED') && (
                              <Badge className="bg-[#e8f5ed] text-[#0d7a46] hover:bg-[#d1ebd9] border border-[#bce2cc] shadow-sm rounded-none px-2 py-0.5 uppercase tracking-wide text-[10px] font-bold">
                                Completed
                              </Badge>
                            )}
                            {txn.status === 'PENDING' && (
                              <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 shadow-sm rounded-none px-2 py-0.5 uppercase tracking-wide text-[10px] font-bold">
                                Pending
                              </Badge>
                            )}
                            {txn.status === 'FAILED' && (
                              <Badge className="bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 shadow-sm rounded-none px-2 py-0.5 uppercase tracking-wide text-[10px] font-bold">
                                Failed
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="py-4 px-6 text-right whitespace-nowrap">
                             <span className={`font-bold ${txn.type === 'DEPOSIT' ? 'text-[#0d7a46]' : 'text-[#0a1930]'}`}>
                               {txn.type === 'DEPOSIT' ? '+' : ''}{formatCurrency(txn.amount, "USD")}
                             </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination Footer */}
                <div className="flex items-center justify-between px-8 py-5 border-t border-slate-300 bg-slate-100">
                  <p className="text-sm font-bold text-slate-600">
                    Showing Page {data.number + 1} of {data.totalPages}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-300 text-slate-700 bg-white hover:bg-slate-100 rounded-none"
                      onClick={() => setPage(p => p - 1)}
                      disabled={data.first || isLoading}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-300 text-slate-700 bg-white hover:bg-slate-100 rounded-none"
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