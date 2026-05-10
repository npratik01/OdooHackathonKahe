"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { DollarSign, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { updateTripBudget } from "@/actions/finances";
import { BudgetFormData, BudgetSchema } from "@/lib/validations/finances";
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

interface SetBudgetModalProps {
  tripId: string;
  currentBudget?: number | null;
}

export function SetBudgetModal({ tripId, currentBudget }: SetBudgetModalProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>();

  const form = useForm<BudgetFormData>({
    resolver: zodResolver(BudgetSchema) as any,
    defaultValues: {
      budget: currentBudget || undefined,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: BudgetFormData) => {
    setError(undefined);
    const res = await updateTripBudget(tripId, values);

    if (res.error) {
      setError(res.error);
    } else {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <DollarSign className="mr-2 h-4 w-4" />
          Set Budget
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Trip Budget</DialogTitle>
          <DialogDescription>
            Enter your total target budget for this trip. We'll alert you if you go over.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="budget">Total Budget</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="budget"
                type="number"
                step="0.01"
                placeholder="1000.00"
                className="pl-9"
                {...form.register("budget")}
                disabled={isSubmitting}
              />
            </div>
            {form.formState.errors.budget && (
              <p className="text-[10px] text-destructive">{form.formState.errors.budget.message}</p>
            )}
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
              Save Budget
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
