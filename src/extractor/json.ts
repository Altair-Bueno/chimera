import { FileExtractor } from "./file.ts";

export class JsonExtractor<C> extends FileExtractor<C> {
  constructor(filename: string) {
    super(filename, Deno.readTextFile, JSON.parse);
  }
}

export default JsonExtractor;
