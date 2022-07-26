/**
 * Extractor provides a common interface for loading configuration objects
 */
export interface Extractor<C> {
  /**
   * Extracts a configuration object
   */
  extract: () => Promise<C>;
}

// Re export module
export * from "./json.ts";
export * from "./yaml.ts";
export * from "./file.ts";
export * from "./env.ts";
export * from "./default.ts";
export * from "./commandline.ts";
