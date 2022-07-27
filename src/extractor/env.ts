import { Extractor } from "./index.ts";

/**
 * A function capable of loading the raw environment into an indexable record
 */
export type EnvironmentLoader = () => Record<string, string>;

type Base = string;
type Chain = Base | [string, Chain];
// Mergeable = Record<string, Mergeable> | unknown; if typescript where any good with recursion...
type Mergeable = Record<string, unknown> | unknown;

// separator: '_'
// FOO_BAZ_TIN_TO => [FOO, [BAZ, [TIN, TO]]]
function breakdown([k, v]: [string, string], separator: string): Chain {
  const result = k
    .split(separator)
    .reverse()
    .reduce((acc, name) => [name, acc] as Chain, v as Chain);
  return result;
}

function mergeChain(acc: Mergeable, chain: Chain): Mergeable {
  const isBase = !Array.isArray(chain);
  // Base case
  if (isBase) {
    try {
      return JSON.parse(chain);
    } catch {
      return chain;
    }
  }

  // Recursive traversal
  const [key, value] = chain;

  if (acc && typeof acc == "object") {
    // The accumulator is an object that can be indexed using strings (Record)
    const indexable = acc as Record<string, Mergeable>;
    indexable[key] = mergeChain(indexable[key], value);

    return indexable;
  } else {
    // The accumulator is not initiated
    return Object.fromEntries([[key, mergeChain(null, value)]]);
  }
}

/**
 * An extractor for environment variables
 *
 * - Keys will be interpreted as **lowercase** strings, meaning that loading
 *   uppercase properties is not supported
 * - Keys that do not start with the provided prefix will be ignored
 * - Separator instructs the extractor on how to nest configuration objects
 *   (see below for an example)
 * - Values will be serialized as JSON if possible. Otherwise they will be
 *   loaded as plain strings
 *
 * ## Example
 *
 * ```ts
 * import { EnvExtractor } from './env.ts';
 *
 * const extractor = new EnvExtractor('PREFIX_');
 * const config = await extractor.extract();
 * console.log(config);
 * ```
 *
 * ```sh
 * $ PREFIX_FOO=10 deno run -A script
 * { foo: 10 }
 * $ PREFIX_BAZ_DEEP_FOO='{"hello": "world"}' deno run -A script
 * { baz: { deep: { foo: { hello: "world" } } } }
 * $ FOO=10 deno run -A script
 * { }
 * $ prefix_biz=42 deno run -A script
 * { biz: 42 }
 * ```
 */
export class EnvExtractor<C> implements Extractor<C> {
  readonly prefix: string;
  readonly separator: string;
  readonly environmentLoader: EnvironmentLoader;

  /**
   * Creates a new EnvExtractor
   *
   * @param prefix Extract only variables whose keys start with the given prefix
   * @param separator Separator used to nest objects. Defaults to `_`
   * @param environmentLoader Function that loads the raw environment into an indexable record. Defaults to {@linkcode Deno.env.toObject}
   */
  constructor(
    prefix: string,
    separator: string = "_",
    environmentLoader: EnvironmentLoader = Deno.env.toObject,
  ) {
    this.prefix = prefix.toLowerCase();
    this.separator = separator.toLowerCase();
    this.environmentLoader = environmentLoader;
  }

  /**
   * Extracts a configuration object from the environment function
   *
   * @returns The configuration object
   */
  // deno-lint-ignore require-await
  async extract() {
    const rawEnv = this.environmentLoader();
    const result = Object.entries(rawEnv)
      // Lowercase all environment variables
      .map(([k, v]) => [k.toLowerCase(), v])
      // Remove variables that do not start with the required prefix
      .filter((x) => x[0].startsWith(this.prefix))
      // Remove the prefix
      .map(([k, v]) => [k.substring(this.prefix.length), v] as [string, string])
      // Break strings into recursive Chains
      .map((x) => breakdown(x, this.separator))
      // Merge all chains
      .reduce(mergeChain, {} as Mergeable);

    return result as C;
  }
}

export default EnvExtractor;
