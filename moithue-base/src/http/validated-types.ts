import type { z } from 'zod';

/** Shape inferred from a Zod schema used with `zValidator`. */
export type Validated<S extends z.ZodTypeAny> = z.infer<S>;
