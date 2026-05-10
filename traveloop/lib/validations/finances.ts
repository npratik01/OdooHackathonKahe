import { CurrencyCode, ExpenseCategory, ExpensePaymentMethod } from "@prisma/client";
import { z } from "zod";

export const ExpenseSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  currency: z.nativeEnum(CurrencyCode).default(CurrencyCode.USD),
  category: z.nativeEnum(ExpenseCategory).default(ExpenseCategory.OTHER),
  paymentMethod: z.nativeEnum(ExpensePaymentMethod).default(ExpensePaymentMethod.CARD),
  occurredAt: z.coerce.date(),
  merchant: z.string().max(160, "Merchant name is too long").optional().nullable(),
  description: z.string().max(255, "Description is too long").optional().nullable(),
  tripStopId: z.string().optional().nullable(),
});

export type ExpenseFormData = z.infer<typeof ExpenseSchema>;

export const BudgetSchema = z.object({
  budget: z.coerce.number().min(0, "Budget must be 0 or greater").optional().nullable(),
});

export type BudgetFormData = z.infer<typeof BudgetSchema>;
