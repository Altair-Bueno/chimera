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
