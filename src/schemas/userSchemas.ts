import { z } from "zod";

export const userRegistrationSchema = z.object({
    name: z.string().nonempty(),
    email: z.string().email(),
    password: z.string().min(8)
});

export const userLoginShema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
});