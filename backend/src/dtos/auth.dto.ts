import { z } from "zod";

export const RegisterDto = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(6)
});

export const LoginDto = z.object({
  email: z.email(),
  password: z.string().min(6)
});

export type RegisterInput = z.infer<typeof RegisterDto>;
export type LoginInput = z.infer<typeof LoginDto>;
