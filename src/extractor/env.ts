import { Extractor } from "./index.ts";

type Base = string;
type Chain = Base | [string, Chain];
// Mergeable = Record<string, Mergeable> | unknown; if typescript where any good...
type Mergeable = unknown;

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
  const isRecursive = Array.isArray(chain);

  if (isRecursive) {
    // Recursive chain
    const [key, value] = chain;

    if (typeof acc == "object" && acc) {
      // The accumulator is an object that can be indexed using strings (Record)
      const indexable = acc as Record<string, Mergeable>;
      indexable[key] = mergeChain(indexable[key], value);
      return indexable;
    } else if (acc) {
      // The accumulator is an object that cannot be indexed
      throw new Error("Unexpected token");
    } else {
      // The accumulator is not initiated
      return Object.fromEntries([[key, mergeChain(null, value)]]);
    }
  } else {
    // Base case
    try {
      return JSON.parse(chain);
    } catch {
      return chain;
    }
  }
}

/**
 * An extractor for reading environment variables
 *
 * - Keys will be interpreted as **lowercase** strings, meaning that loading uppercase characters is not supported
 * - Keys that do not start with the provided prefix will be ignored
 * - Separator instructs the extractor on how to nest configuration objects (see below for an example)
 * - Values will be serialized as JSON if possible. Otherwise they will be loaded as plain strings
 *
 * ```sh
 * # prefix: PREFIX_
 * # separator: _
 * PREFIX_FOO=10 # { foo: 10 }
 * PREFIX_BAZ_DEEP_FOO='{"hello": "world"}' # { baz: { deep: { foo: { hello: "world" } } } }
 * FOO=10 # -
 * prefix_biz=42 # { biz: 42 }
 * ```
 */
export class EnvExtractor<C> implements Extractor<C> {
  readonly prefix: string;
  readonly separator: string;

  /**
   * Creates a new EnvExtractor
   * @param prefix Extract only variables whose keys start with the given prefix
   * @param separator Separator used to nest objects
   */
  constructor(prefix: string, separator = "_") {
    this.prefix = prefix.toLowerCase();
    this.separator = separator.toLowerCase();
  }

  /**
   * Creates an object using environment variables
   * @returns extracted object
   */
  // deno-lint-ignore require-await
  async extract() {
    const rawEnv = Deno.env.toObject();
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
