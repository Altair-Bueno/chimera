import { Extractor } from "./index.ts";

export type TextFileLoader = (filename: string) => Promise<string>;
export type Serializer = (data: string) => unknown;

export class FileExtractor<C> implements Extractor<C> {
  filename: string;
  textFileLoader: TextFileLoader;
  serializer: Serializer;

  constructor(
    filename: string,
    textFileLoader: TextFileLoader,
    serializer: Serializer,
  ) {
    this.filename = filename;
    this.textFileLoader = textFileLoader;
    this.serializer = serializer;
  }

  async extract() {
    const content = await this.textFileLoader(this.filename);
    const loaded = this.serializer(content);
    return loaded as C;
  }
}

export default FileExtractor;
