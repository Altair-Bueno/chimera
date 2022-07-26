// Extractors
export {
  CommandLineExtractor,
  DefaultExtractor,
  EnvExtractor,
  FileExtractor,
  JsonExtractor,
  YamlExtractor,
} from "./extractor/index.ts";

// Magic functions
export { auto } from "./auto.ts";
export { getConfig } from "./getconfig.ts";

// Types and interfaces
export type { Extractor } from "./extractor/index.ts";
export type { GetConfigParams } from "./getconfig.ts";
export type { AutoParams } from "./auto.ts";
