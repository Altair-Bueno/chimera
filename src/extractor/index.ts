export interface Extractor<C> {
  extract: () => Promise<C>;
}

// Re export module
export * from "./json.ts";
export * from "./yaml.ts";
export * from "./file.ts";
export * from "./env.ts";
