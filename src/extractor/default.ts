import { Extractor } from "./index.ts";

/**
 * An extractor that wraps a config object, useful for providing default values
 *
 * ## Example
 *
 * ```ts
 * import { DefaultExtractor } from './default.ts';
 *
 * const baseConfig = { property: "value" };
 * const extractor = new DefaultExtractor(baseConfig);
 * const config = await extractor.extract();
 *
 * // config === baseConfig
 * ```
 */
export class DefaultExtractor<C> implements Extractor<C> {
  readonly config: C;

  /**
   * Creates a new DefaultExtractor
   *
   * @param config A configuration object to wrap
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

export default DefaultExtractor;
