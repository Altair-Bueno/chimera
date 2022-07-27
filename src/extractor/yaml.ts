import { yaml } from "../../deps.ts";
import { FileExtractor } from "./file.ts";

/**
 * An extractor for YAML files
* ## Example
 * 
 * ```ts
 * import { YamlExtractor } from './yaml.ts';
 *
 * const extractor = new YamlExtractor('config.json');
 * const config = await extractor.extract();
 * console.log(config);
 * ```
 */
export class YamlExtractor<C> extends FileExtractor<C> {
  /**
   * Creates a YamlExtractor
   * @param filename Path that references the file
   */
  constructor(filename: string) {
    super(filename, Deno.readTextFile, (x) => yaml.parse(x) as C);
  }
}

export default YamlExtractor;
