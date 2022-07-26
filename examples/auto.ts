/**
 * Sample usage of `auto`
 *
 * Use `deno run --allow-env --allow-read examples/auto.ts` from the root
 * directory to run this example. Try using command line arguments to change the
 * settings!
 */

import { auto } from "../mod.ts";

// The Config interfaces defines the expected configuration object
interface Config {
  hostname: string;
  authentication: {
    type: string;
    expires: number;
  };
}

// Calling `auto` extracts the configuration object from Yaml and json files,
// environment variables and command line arguments
const config: Config = await auto({ name: "config", configDir: "examples/" });
console.log(config);
