import { Extractor } from "./index.ts";

/**
 * An extractor that wraps a config object, useful for providing default values
 */
export class DefaultExtractor<C> implements Extractor<C> {
  readonly config: C;

  /**
   * Creates a new StaticExtractor
   *
   * @param config Config object
   */
  constructor(config: C) {
    this.config = config;
  }
  /**
   * @returns The wrapped config object
   */
  // deno-lint-ignore require-await
  async extract() {
    return this.config;
  }
}

export default DefaultExtractor