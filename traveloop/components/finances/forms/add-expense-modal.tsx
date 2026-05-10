"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { CurrencyCode, ExpenseCategory, ExpensePaymentMethod } from "@prisma/client";
import { addExpense } from "@/actions/finances";
import { ExpenseFormData, ExpenseSchema } from "@/lib/validations/finances";
import { TripStopWithActivities } from "@/actions/itinerary";
import { FormError } from "@/components/auth/form-error";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddExpenseModalProps {
  tripId: string;
  stops: TripStopWithActivities[];
}

export function AddExpenseModal({ tripId, stops }: AddExpenseModalProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>();

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(ExpenseSchema) as any,
    defaultValues: {
      amount: 0,
      currency: CurrencyCode.USD,
      category: ExpenseCategory.OTHER,
      paymentMethod: ExpensePaymentMethod.CARD,
      occurredAt: new Date(),
      merchant: "",
      description: "",
      tripStopId: undefined,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: ExpenseFormData) => {
    setError(undefined);
    const res = await addExpense(tripId, values);

    if (res.error) {
      setError(res.error);
    } else {
      setOpen(false);
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>
            Log a new transaction.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                {...form.register("amount")}
                disabled={isSubmitting}
              />
              {form.formState.errors.amount && (
                <p className="text-[10px] text-destructive">{form.formState.errors.amount.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select 
                defaultValue={CurrencyCode.USD} 
                onValueChange={(val: string) => form.setValue("currency", val as CurrencyCode)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(CurrencyCode).map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="merchant">Merchant</Label>
            <Input
              id="merchant"
              placeholder="e.g. Starbucks, Delta Airlines"
              {...form.register("merchant")}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                defaultValue={ExpenseCategory.OTHER} 
                onValueChange={(val: string) => form.setValue("category", val as ExpenseCategory)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ExpenseCategory).map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select 
                defaultValue={ExpensePaymentMethod.CARD} 
                onValueChange={(val: string) => form.setValue("paymentMethod", val as ExpensePaymentMethod)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ExpensePaymentMethod).map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="occurredAt">Date</Label>
            <Input
              id="occurredAt"
              type="date"
              {...form.register("occurredAt")}
              disabled={isSubmitting}
            />
            {form.formState.errors.occurredAt && (
              <p className="text-[10px] text-destructive">{form.formState.errors.occurredAt.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tripStopId">Link to Stop (Optional)</Label>
            <Select 
              onValueChange={(val: string) => form.setValue("tripStopId", val === "none" ? null : val)}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="General Trip Expense" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">General Trip Expense</SelectItem>
                {stops.map((stop) => (
                  <SelectItem key={stop.id} value={stop.id}>{stop.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              {...form.register("description")}
              disabled={isSubmitting}
            />
          </div>

          <FormError message={error} />
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Expense
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
