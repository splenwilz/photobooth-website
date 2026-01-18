import z from "zod";


export const ResetPasswordRequestSchema = z.object({
    token: z.string().min(1, { message: 'Token is required' }),
    new_password: z.string()
        .min(8, { message: 'Password must be at least 8 characters' })
        .regex(/\d/, { message: 'Password must contain at least one number' })
        .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
        .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' }),
    confirm_new_password: z.string()
        .min(8, { message: 'Password must be at least 8 characters' })
        .regex(/\d/, { message: 'Password must contain at least one number' })
        .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
        .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' }),
}).refine((data) => data.new_password === data.confirm_new_password, {
    message: 'Passwords do not match',
    path: ['confirm_new_password'],
})

export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;