import { z } from "zod";

export const syncCalendarSchema = z.object({
    provider: z.enum(['google']),
    startDate: z.string().nonempty(),
    endDate: z.string().nonempty(),
});