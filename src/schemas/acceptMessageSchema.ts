import { z } from "zod";

export const acceptMessageSchema = z.object({
  acceptsMessages: z.boolean(),
});
