import * as path from "https://deno.land/std/path/mod.ts";
import { YamlExtractor } from "./yaml.ts";
import { JsonExtractor } from "./json.ts";
import { FileExtractor } from "./file.ts";

/**
 * Extractor provides a common interface for loading configuration objects
 */
export interface Extractor<C> {
  /**
   * Extracts a configuration object
   */
  extract: () => Promise<C>;
}

/**
 * Creates a concrete file extractor based on the path extension. Yaml and JSON
 * formats are supported
 *
 * @param filePath A string that represents a file
 * @returns The extractor object, null if no extractor could be inferred
 */
export function toFileExtractor<C>(filePath: string): FileExtractor<C> | null {
  const extension = path.extname(filePath).toLowerCase();

  if (extension == ".yaml" || extension === ".yml") {
    return new YamlExtractor(filePath);
  } else if (extension === ".json") {
    return new JsonExtractor(filePath);
  } else {
    return null;
  }
}

// Re export module
export * from "./json.ts";
export * from "./yaml.ts";
export * from "./file.ts";
export * from "./env.ts";
export * from "./default.ts";
export * from "./commandline.ts";
