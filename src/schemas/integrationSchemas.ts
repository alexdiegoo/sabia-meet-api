import { z } from "zod";

export const createIntegrationSchema = z.object({
    provider: z.string().nonempty(),
    accessToken: z.string().nonempty(),
    refreshToken: z.string().nonempty(),
    expiresAt: z.string().nonempty()
});