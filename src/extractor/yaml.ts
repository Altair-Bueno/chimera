import { parse } from "encoding/yaml.ts";
import { FileExtractor } from "./file.ts";

export class YamlExtractor<C> extends FileExtractor<C> {
  constructor(filename: string) {
    super(filename, Deno.readTextFile, parse);
  }
}

export default YamlExtractor;
