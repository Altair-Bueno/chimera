// Extractors
export {
  CommandLineExtractor,
  DefaultExtractor,
  EnvExtractor,
  FileExtractor,
  JsonExtractor,
  toFileExtractor,
  YamlExtractor,
} from "./extractor/index.ts";

// Magic functions
export { auto } from "./auto.ts";
export { getConfig } from "./getconfig.ts";

// Types and interfaces
export type { Extractor } from "./extractor/index.ts";
export type { GetConfigParams } from "./getconfig.ts";
export type { Deserializer, FileLoader } from "./extractor/file.ts";
export type { EnvironmentLoader } from "./extractor/env.ts";
export type { AutoParams } from "./auto.ts";
