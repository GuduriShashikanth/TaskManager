import { z } from "zod";

export const RegisterDto = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .trim(),
  email: z
    .string({ message: "Email is required" })
    .regex(/^\S+@\S+\.\S+$/, "Invalid email format")
    .toLowerCase()
    .trim(),
  password: z
    .string({ message: "Password is required" })
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
});

export const LoginDto = z.object({
  email: z
    .string({ message: "Email is required" })
    .regex(/^\S+@\S+\.\S+$/, "Invalid email format")
    .toLowerCase()
    .trim(),
  password: z.string({ message: "Password is required" }).min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof RegisterDto>;
export type LoginInput = z.infer<typeof LoginDto>;
