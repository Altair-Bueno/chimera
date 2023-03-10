import { Extractor } from "./index.ts";
import * as flags from "https://deno.land/std/flags/mod.ts";

/**
 * Extracts configuration options from command line arguments
 *
 * - Commands may use dot notation for nesting properties
 * - Only flags will be parsed, single arguments will be ignored
 *
 * ## Example
 *
 * ```ts
 * import { CommandLineExtractor } from './commandline.ts';
 *
 * const extractor = new CommandLineExtractor();
 * const config = await extractor.extract();
 * console.log(config);
 * ```
 *
 * ```sh
 * $ deno run script --foo.baz=10
 * { foo: { baz: 10  } }
 * $ deno run script -d
 * { d: true }
 * $ deno run script foo
 * {}
 * ```
 */
export class CommandLineExtractor<C> implements Extractor<C> {
  args: string[];

  /**
   * Creates a new CommandLineExtractor that parses the provided argument list
   *
   * @param args Argument list. Defaults to {@linkcode Deno.args}
   */
  constructor(args: string[] = Deno.args) {
    this.args = args;
  }

  /**
   * Extracts a config object from command line arguments
   *
   * @returns The extracted object
   */
  // deno-lint-ignore require-await
  async extract() {
    const parsed = flags.parse(this.args);
    // Make _ (string | number []) | undefined so it can be removed
    const partial = parsed as Partial<typeof parsed>;
    delete partial["_"];

    return partial as C;
  }
}

export default CommandLineExtractor;
