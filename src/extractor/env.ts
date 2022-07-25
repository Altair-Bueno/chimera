import { Extractor } from "./index.ts";

type Base = string;
type Chain = Base | [string, Chain];
type Mergeable = unknown;

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

export class EnvExtractor<C> implements Extractor<C> {
  prefix: string;
  separator: string;

  constructor(prefix: string, separator = "_") {
    this.prefix = prefix.toLowerCase();
    this.separator = separator.toLowerCase();
  }

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
