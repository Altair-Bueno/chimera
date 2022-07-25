/**
 * Sample usage of `auto`
 *
 * Use `deno run --allow-env --allow-read examples/auto.ts` from the root
 * directory to run this example
 */

import { auto } from "../mod.ts";

interface Config {
  hostname: string;
  authentication: {
    type: string;
    expires: number;
  };
}

const config: Config = await auto({ name: "config", configDir: "examples/" });
console.log(config);
