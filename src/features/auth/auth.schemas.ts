import { z } from 'zod';

// --- Schemas de formulario ---

export const loginFormSchema = z.object({
  email: z.string().email('Ingresa un correo electrónico válido.'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.'),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

export const registerFormSchema = z
  .object({
    email: z.string().email('Ingresa un correo electrónico válido.'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerFormSchema>;

// --- Schema de respuesta del servidor ---
// Valida lo que llega del backend antes de usarlo (parse, no `as`).

const actorSchema = z.object({
  capacities: z.array(z.enum(['customer', 'provider'])),
  platformRole: z.enum(['user', 'moderator', 'admin']).optional(),
});

export const authResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  actor: actorSchema,
});

export type AuthResponse = z.infer<typeof authResponseSchema>;
