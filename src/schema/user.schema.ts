import { z } from 'zod';

export const UserSchema = z.object({
    firstname: z.string().min(1, "The name can't be empty"),
    lastname: z.string().min(1, "The last name can't be empty"),
    dateOfBirth: z.string(),
    email: z.email(),
    password: z.string().min(5, "Password must be at least 5 letters long"),
    role: z.union([z.literal('admin'), z.literal('user')], "Role required"),
    status: z.union([z.literal('active'), z.literal('deactivated')], "Status required")
});

export const RegSchema = z.object({
    firstname: z.string().min(1, "The name can't be empty"),
    lastname: z.string().min(1, "The last name can't be empty"),
    dateOfBirth: z.string(),
    email: z.email(),
    password: z.string().min(5, "Password must be at least 5 letters long"),
});

export const DisableUserSchema = z.object({
    id: z.string()
})