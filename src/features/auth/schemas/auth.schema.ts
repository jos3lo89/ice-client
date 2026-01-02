import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, "El usuario debe tener al menos 3 caracteres")
    .max(50, "El usuario no puede exceder 50 caracteres"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña no puede exceder 100 caracteres"),
});

export const loginWithPinSchema = z.object({
  pin: z
    .string()
    .length(6, "El PIN debe tener exactamente 6 dígitos")
    .regex(/^\d+$/, "El PIN solo puede contener números"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "La contraseña actual debe tener al menos 6 caracteres"),
    newPassword: z
      .string()
      .min(6, "La nueva contraseña debe tener al menos 6 caracteres")
      .max(100, "La contraseña no puede exceder 100 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type LoginWithPinFormValues = z.infer<typeof loginWithPinSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
