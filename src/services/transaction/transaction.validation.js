import { z } from "zod";

export const depositSchema = z
  .object({
    usercode: z.string().email("Please enter a valid email"),
    paymethod: z.string().min(1, "Please select a payment method"),
    amount: z
      .string()
      .min(1, "Please enter an amount")
      .refine(value => value.trim() === "" || Number(value) > 0, {
        message: "Amount must be greater than 0",
      }),
    comment: z.string().min(1, "Please enter a comment"),
    transid: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Transaction ID is only required if payment method is not "Cash"
    if (data.paymethod !== "Cash") {
      if (!data.transid || data.transid.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["transid"],
          message: "Please enter a transaction ID or UTR",
        });
      }
    }
  });

// WithdrawalSchema
export const withdrawalSchema = z
  .object({
    usercode: z.string().email("Please enter a valid email"),
    paymethod: z.string().min(1, "Please select a payment method"),
    amount: z
      .string()
      .min(1, "Please enter an amount")
      .refine(value => value.trim() === "" || Number(value) > 0, {
        message: "Amount must be greater than 0",
      }),
    comment: z.string().min(1, "Please enter a comment"),
    chainname: z.string().optional(),
    wallet_address: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Chain and wallet address are only required for crypto withdrawals.
    if (data.paymethod === "Crypto") {
      if (!data.chainname || data.chainname.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["chainname"],
          message: "Please enter a chain name",
        });
      }
      if (!data.wallet_address || data.wallet_address.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["wallet_address"],
          message: "Please enter a wallet address",
        });
      }
    }
  });
