import { z } from "zod";

export const bankInfoSchema = z.object({
  bankname: z.string().min(1, "Please enter your bank name"),
  accname: z.string().min(1, "Please enter your account holder name"),
  accno: z
    .string()
    .min(1, "Account number is required")
    .regex(/^\d+$/, "Account number must contain only numbers"),
  ifsc: z.string().min(1, "Please enter your Swift/IFSC code"),
  iban_number: z.string().min(1, "Please enter your IBAN number"),
});
