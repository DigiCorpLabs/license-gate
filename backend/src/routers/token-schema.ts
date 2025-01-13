import {z} from "zod";

export const tokenCreateSchema = z.object({
  idc: z.string().uuid(),
});

export type TokenCreateInput = z.infer<typeof tokenCreateSchema>;
