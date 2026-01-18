import { z } from "zod";

/**
 * Schema for user signup/registration request
 * Matches the backend API expectations
 */
export const SignupRequestSchema = z.object({
  first_name: z.string().min(2).max(50),
  last_name: z.string().min(2).max(50),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8),
  confirm_password: z.string().min(8),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"], // This will show the error on confirm_password field
});

export type SignupRequest = z.infer<typeof SignupRequestSchema>;

