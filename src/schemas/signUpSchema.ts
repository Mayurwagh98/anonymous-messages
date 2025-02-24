import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(3, "Username must be at least 3 characters long")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters");

export const signUpSchema = z.object({
  username: userNameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(3, { message: "password should be atleast of 3 characters" })
    .max(8),
});
