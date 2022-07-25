import { FileExtractor } from "./file.ts";

/**
 * An extractor that extends `FileExtractor` using JavaScript Object Notation (JSON)
 */
export class JsonExtractor<C> extends FileExtractor<C> {
  /**
   * Create a JsonExtractor
   * @param filename filename used to reference the file
   */
  constructor(filename: string) {
    super(filename, Deno.readTextFile, JSON.parse);
  }
}

export default JsonExtractor;
