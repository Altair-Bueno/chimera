/**
 * Sample usage of chimera with `zod` https://deno.land/x/zod
 *
 * Use `deno run --allow-env --allow-read examples/zod.ts` from the root
 * directory to run this example. Try using command line arguments to change the
 * settings!
 */

import { z } from "https://deno.land/x/zod/mod.ts";
import { auto } from "../mod.ts";

const CONFIG_SCHEME = z.object({
  hostname: z.string(),
  authentication: z.object({
    type: z.string(),
    expires: z.number().positive(),
  }),
});

const config = await auto({ name: "config", configDir: "examples/" }).then(
  (x) => CONFIG_SCHEME.parseAsync(x),
);

console.log(config);
