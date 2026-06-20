import { z } from "zod";

export const internalTransferSchema = z.object({
  sender: z
    .string()
    .min(1, "Sender email is required")
    .email("Please enter a valid sender email"),

  receiver: z
    .string()
    .min(1, "Receiver email is required")
    .email("Please enter a valid receiver email"),

  amount: z
    .string()
    .min(1, "Please enter a valid amount")
    .refine(value => Number(value) > 0, "Amount must be greater than 0"),
  comment: z.string().min(1, "Please enter a comment"),
});
