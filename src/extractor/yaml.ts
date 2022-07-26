import { parse } from "encoding/yaml.ts";
import { FileExtractor } from "./file.ts";

/**
 * An extractor for YAML files
 */
export class YamlExtractor<C> extends FileExtractor<C> {
  /**
   * Creates a YamlExtractor
   * @param filename Path that references the file
   */
  constructor(filename: string) {
    super(filename, Deno.readTextFile, (x) => parse(x) as C);
  }
}

export default YamlExtractor;
