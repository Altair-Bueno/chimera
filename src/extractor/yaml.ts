import { parse } from "encoding/yaml.ts";
import { FileExtractor } from "./file.ts";

/**
 * An extractor that extends `FileExtractor` using YAML
 */
export class YamlExtractor<C> extends FileExtractor<C> {
  /**
   * Create a YamlExtractor
   * @param filename filename used to reference the file
   */
  constructor(filename: string) {
    super(filename, Deno.readTextFile, (x) => parse(x) as C);
  }
}

export default YamlExtractor;
