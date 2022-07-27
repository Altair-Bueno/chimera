import { FileExtractor } from "./file.ts";

/**
 * An extractor for JSON files
 *
 * ## Example
 *
 * ```ts
 * import { JsonExtractor } from './json.ts';
 *
 * const extractor = new JsonExtractor('config.json');
 * const config = await extractor.extract();
 * console.log(config);
 * ```
 */
export class JsonExtractor<C> extends FileExtractor<C> {
  /**
   * Create a JsonExtractor
   * @param filename Path that references the file
   */
  constructor(filename: string) {
    super(filename, Deno.readTextFile, JSON.parse);
  }
}

export default JsonExtractor;
