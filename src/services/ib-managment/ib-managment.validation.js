import { z } from "zod";

export const ibMoveSchema = z
  .object({
    user_ref_code: z
      .string()
      .min(1, "Target email is required")
      .email("Please enter a valid target email"),

    user_ref_code2: z
      .string()
      .min(1, "New upline email is required")
      .email("Please enter a valid new upline email"),
  })
  .refine(
    (data) =>
      data.user_ref_code.trim().toLowerCase() !==
      data.user_ref_code2.trim().toLowerCase(),
    {
      message: "Target Email and New Upline Email cannot be same",
      path: ["user_ref_code2"],
    },
  );
