import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Send } from "lucide-react";

import { accountService } from "@/services/accountService";
import { transactionService } from "@/services/transactionService";
import type { Account } from "@/types/account";
import type { TransactionRequest } from "@/types/transaction";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const transferSchema = z.object({
  sourceAccountNumber: z.string().min(1, { message: "Please select a source account." }),
  destinationAccountNumber: z.string().min(5, { message: "Destination account must be valid." }),
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
      description: "",
    },
  });

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
      // Map the form values to the NEW backend keys
      const payload: TransactionRequest = {
        sourceAccountId: values.sourceAccountNumber,
        destinationAccountId: values.destinationAccountNumber,
        amount: values.amount,
        currency: values.currency,
        type: 'TRANSFER', // Map "TRANSFER" to the "type" key
        description: values.description,
      };

      await transactionService.transfer(payload);
      
      toast.success("Transfer successful!");
      navigate("/dashboard");
    } catch (error: any) {
      // Show the actual validation errors if it fails again
      const serverMessage = error.response?.data?.errors?.[0] || "Invalid request content";
      toast.error("Validation Failed", { description: serverMessage });
    } finally {
      setIsTransferring(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" className="mb-6 text-slate-500" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-white">
            <CardTitle className="text-2xl font-semibold">Transfer Funds</CardTitle>
            <CardDescription>Move money securely between FinGuard accounts.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 bg-white">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="sourceAccountNumber"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>From Account</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingAccounts || isTransferring}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={isLoadingAccounts ? "Loading..." : "Select an account"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {accounts.map((acc) => (
                            <SelectItem key={acc.id} value={acc.accountNumber}>
                              {acc.accountNumber} - ${acc.balance.toFixed(2)}
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
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>To Account Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., SAV-F64FD1D9" {...field} disabled={isTransferring} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Monthly savings" {...field} disabled={isTransferring} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Amount (USD)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field} 
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
                            className="pl-7" 
                            disabled={isTransferring} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-blue-900" disabled={isTransferring}>
                  {isTransferring ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  Execute Transfer
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}