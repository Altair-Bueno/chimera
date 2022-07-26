import { Extractor } from "./index.ts";

export type TextFileLoader = (filename: string) => Promise<string>;
export type Deserializer<C> = (data: string) => C;

/**
 * A base extractor for deserializing text files
 */
export class FileExtractor<C> implements Extractor<C> {
  readonly filename: string;
  readonly textFileLoader: TextFileLoader;
  readonly deserializer: Deserializer<C>;

  /**
   * Create a file extractor
   * @param filename Path that references the file
   * @param textFileLoader A function that loads a text file into a string
   * @param deserializer A function that deserializes an object
   */
  constructor(
    filename: string,
    textFileLoader: TextFileLoader,
    deserializer: Deserializer<C>,
  ) {
    this.filename = filename;
    this.textFileLoader = textFileLoader;
    this.deserializer = deserializer;
  }

  /**
   * Deserializes `this.filename` and returns the result
   * @returns Deserialized object from `this.filename`
   */
  async extract() {
    const content = await this.textFileLoader(this.filename);
    const loaded = this.deserializer(content);
    return loaded;
  }
}

export default FileExtractor;
