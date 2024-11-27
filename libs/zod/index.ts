import { z } from "zod";

export const swapTokensSchema = z.object({
  fromTokenAmount: z.string().min(1, "Use 1 characters or more"),
});

export type TSwapTokensSchema = z.infer<typeof swapTokensSchema>;
