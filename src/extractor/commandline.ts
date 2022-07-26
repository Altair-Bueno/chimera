import { Extractor } from "./index.ts";
import { flags } from "../../deps.ts";

/**
 * Extracts configuration options from command line arguments
 *
 * - Commands may use dot notation for nesting properties
 * - Only flags will be parsed, single arguments will be ignored
 *
 * ```sh
 * deno run script --foo.baz=10 # { foo: { baz: 10  } }
 * deno run script -d # { d: true }
 * deno run script foo # {}
 * ```
 */
export class CommandLineExtractor<C> implements Extractor<C> {
  args: string[];

  /**
   * Creates a new CommandLineExtractor that parses the provided argument list
   *
   * @param args Argument list
   */
  constructor(args: string[] = Deno.args) {
    this.args = args;
  }

  /**
   * Extracts a config object form command line arguments
   *
   * @returns The extracted object
   */
  // deno-lint-ignore require-await
  async extract() {
    const parsed = flags.parse(this.args);
    // Make _ (string | numnber []) | undefined so it can be removed
    const partial = parsed as Partial<typeof parsed>;
    delete partial["_"];

    return partial as C;
  }
}

export default CommandLineExtractor;
