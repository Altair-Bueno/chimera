import type { Extractor } from "./extractor/index.ts";
import { collections } from "../deps.ts";

/**
 * Parameters for `getConfig`
 */
export interface GetConfigParams<C> {
  /**
   * List of extractors to use. The configurations are merged in order, meaning
   * that the first extractor will be used as base configuration, and the last
   * extractor will take preference over the rest
   */
  extractors: Extractor<C>[];
  /**
   * Callback to execute on extractor error. By default all exceptions are
   * ignored
   */
  errorCallback?: (e: Error) => void;
}

/**
 * Creates a config object using the provided list of extractors
 *
 * @param getConfigParams
 * @returns A configuration object
 */
export async function getConfig<C>({
  extractors,
  errorCallback,
}: GetConfigParams<C>): Promise<C> {
  const promises = extractors.map(async (x) => {
    try {
      return await x.extract();
    } catch (e) {
      errorCallback && errorCallback(e);
      return {};
    }
  });
  const resolved = await Promise.all(promises);
  return resolved.reduce((acc, n) => collections.deepMerge(acc, n), {}) as C;
}
