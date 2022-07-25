import { Extractor } from "./index.ts";

export type TextFileLoader = (filename: string) => Promise<string>;
export type Serializer<C> = (data: string) => C;

/**
 * A base extractor for deserializing text files
 */
export class FileExtractor<C> implements Extractor<C> {
  readonly filename: string;
  readonly textFileLoader: TextFileLoader;
  readonly serializer: Serializer<C>;

  /**
   * Create a file extractor
   * @param filename Name used to reference the file
   * @param textFileLoader A function that loads a text file into a string
   * @param serializer A function that deserializes an object
   */
  constructor(
    filename: string,
    textFileLoader: TextFileLoader,
    serializer: Serializer<C>,
  ) {
    this.filename = filename;
    this.textFileLoader = textFileLoader;
    this.serializer = serializer;
  }

  /**
   * Deserializes `this.filename` and returns the result
   * @returns Deserialized object from `this.filename`
   */
  async extract() {
    const content = await this.textFileLoader(this.filename);
    const loaded = this.serializer(content);
    return loaded;
  }
}

export default FileExtractor;
