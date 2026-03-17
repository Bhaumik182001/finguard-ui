import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Send, ArrowRightLeft } from "lucide-react";

import { accountService } from "@/services/accountService";
import { transactionService } from "@/services/transactionService";
import type { Account } from "@/types/account";
import type { TransactionRequest } from "@/types/transaction";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const transferSchema = z.object({
  sourceAccountNumber: z.string().min(1, { message: "Please select a source account." }),
  destinationAccountNumber: z.string().min(1, { message: "Please select a destination account." }),
  amount: z.number().positive({ message: "Transfer amount must be greater than $0.00." }),
  currency: z.string(),
  transactionType: z.enum(['TRANSFER', 'DEPOSIT', 'WITHDRAWAL']),
  description: z.string().min(3, { message: "Please provide a short description." }),
});

export default function TransferPage() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [isTransferring, setIsTransferring] = useState(false);

  const form = useForm<z.infer<typeof transferSchema>>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      sourceAccountNumber: "",
      destinationAccountNumber: "",
      amount: 0,
      currency: "USD",
      transactionType: "TRANSFER",
      description: "Internal Transfer",
    },
  });

  const sourceAccount = form.watch("sourceAccountNumber");

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await accountService.getMyAccounts();
        setAccounts(data);
      } catch (error) {
        toast.error("Failed to load accounts for transfer.");
      } finally {
        setIsLoadingAccounts(false);
      }
    };
    fetchAccounts();
  }, []);

  async function onSubmit(values: z.infer<typeof transferSchema>) {
    setIsTransferring(true);
    try {
      if (values.sourceAccountNumber === values.destinationAccountNumber) {
         toast.error("Validation Failed", { description: "Source and destination accounts must be different." });
         setIsTransferring(false);
         return;
      }
      const payload: TransactionRequest = {
        sourceAccountId: values.sourceAccountNumber,
        destinationAccountId: values.destinationAccountNumber,
        amount: values.amount,
        currency: values.currency,
        type: 'TRANSFER',
        description: values.description,
      };

      await transactionService.transfer(payload);
      
      toast.success("Transfer Processed", { 
        description: `Successfully transferred $${values.amount.toFixed(2)}`
      });
      navigate("/dashboard");
    } catch (error: any) {
      const serverMessage = error.response?.data?.errors?.[0] || "Invalid request content";
      toast.error("Transfer Failed", { description: serverMessage });
    } finally {
      setIsTransferring(false);
    }
  }

  // Get available destination accounts (exclude source)
  const destinationAccounts = accounts.filter(acc => acc.accountNumber !== sourceAccount);

  // Get selected account balance for display
  const selectedSourceAccount = accounts.find(acc => acc.accountNumber === sourceAccount);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" className="mb-8 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-none" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Return to Dashboard
        </Button>

        <Card className="border-slate-200 shadow-lg rounded-none overflow-hidden">
          <div className="h-2 w-full bg-[#0a1930]"></div>
          <CardHeader className="bg-white border-b border-slate-100 px-8 py-6">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-slate-100 rounded-none flex items-center justify-center">
                <ArrowRightLeft className="text-slate-700 h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Transfer Funds</CardTitle>
                <CardDescription className="text-slate-500 mt-1">Move money instantly between your accounts.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8 px-8 bg-white pb-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                <div className="space-y-6 bg-slate-50 p-6 rounded-none border border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest flex items-center">
                    Account Details
                  </h3>
                  
                  <FormField
                    control={form.control}
                    name="sourceAccountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">Transfer From</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingAccounts || isTransferring}>
                          <FormControl>
                            <SelectTrigger className="h-12 bg-white rounded-none">
                              <SelectValue placeholder={isLoadingAccounts ? "Loading accounts..." : "Select account to debit"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {accounts.map((acc) => (
                              <SelectItem key={acc.id} value={acc.accountNumber} className="cursor-pointer">
                                <div className="flex justify-between items-center w-full min-w-[200px] gap-4">
                                  <span className="font-mono text-slate-700">{acc.accountNumber}</span> 
                                  <span className="text-blue-700 font-semibold">${acc.balance.toFixed(2)}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="destinationAccountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">Transfer To</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingAccounts || isTransferring || !sourceAccount}>
                          <FormControl>
                            <SelectTrigger className="h-12 bg-white rounded-none">
                              <SelectValue placeholder={!sourceAccount ? "Select source first" : "Select receiving account"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {destinationAccounts.map((acc) => (
                              <SelectItem key={acc.id} value={acc.accountNumber} className="cursor-pointer font-mono">
                                {acc.accountNumber}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-2">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">Transfer Amount</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-lg">$</span>
                            <Input 
                              type="number" 
                              step="0.01"
                              placeholder="0.00"
                              {...field} 
                              value={field.value === 0 ? '' : field.value}
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                              className="pl-10 h-14 text-lg font-semibold bg-white border-slate-300 focus:bg-white transition-all shadow-sm rounded-none" 
                              disabled={isTransferring} 
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">USD</span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium">Memo / Description</FormLabel>
                      <FormControl>
                        <Input 
                           placeholder="Optional short description..." 
                           {...field} 
                           className="h-12 rounded-none"
                           disabled={isTransferring} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full h-14 bg-[#0a1930] hover:bg-slate-800 text-white text-lg font-medium shadow-md shadow-slate-900/20 transition-all rounded-none mt-4" 
                  disabled={isTransferring}
                >
                  {isTransferring ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing Transaction...</>
                  ) : (
                    <><Send className="mr-2 h-5 w-5" /> Confirm Transfer</>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}