import type { Extractor } from "./extractor/index.ts";
import {
  EnvExtractor,
  JsonExtractor,
  YamlExtractor,
} from "./extractor/index.ts";
import { extname, join } from "path/mod.ts";
import { getConfig } from "./getconfig.ts";

/**
 * Creates an extractor based on the path extension
 *
 * @param path
 * @returns The extractor object, null if no extractor could be inferred
 */
function toExtractor<C>(path: string): Extractor<C> | null {
  const extension = extname(path).toLowerCase();

  if (extension == ".yaml" || extension === ".yml") {
    return new YamlExtractor(path);
  } else if (extension === ".json") {
    return new JsonExtractor(path);
  } else {
    return null;
  }
}

/**
 * Parameters for `auto`
 */
export interface AutoParams {
  /**
   * Name used as prefix for environment variables and configuration files
   */
  name: string;
  /**
   * Directory where configuration files are located
   */
  configDir?: string;
  /**
   * Callback to execute on extractor error. By default all exceptions are
   * ignored
   */
  errorCallback?: (e: Error) => void;
}

/**
 * Creates a config object with sensible defaults
 *
 * - Loads configuration files from `configDir`
 *   - Only files whose name matches the name parameter will be loaded
 *   - Analyzes the file extension to decide which extractor should be used
 *   - Yaml and Json are supported
 * - Loads environment variables
 *   - The prefix is `${name}_`
 *   - `_` is used as separator
 *
 * @param autoParams
 * @returns A configuration object
 */
export async function auto<C>(autoParams: AutoParams): Promise<C> {
  const name = autoParams.name.toLowerCase();
  const dirname = autoParams.configDir ? autoParams.configDir : Deno.cwd();

  const regex = new RegExp(`${name}\\.\\w+`);

  const extractors = Array.from(Deno.readDirSync(dirname))
    // Only files
    .filter((entry) => entry.isFile)
    // Remove all files whose name isn't expected
    .filter((file) => file.name.toLowerCase().match(regex))
    // Join paths
    .map((file) => join(dirname, file.name))
    // Create extractors
    .map((path) => toExtractor<C>(path))
    // Remove null values (extractors couldn't be generated)
    .filter(Boolean) as Extractor<C>[];
  extractors.push(new EnvExtractor(`${name}_`));

  const errorCallback = autoParams.errorCallback;
  return await getConfig<C>({ extractors, errorCallback });
}
