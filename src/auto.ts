import { DefaultExtractor, Extractor } from "./extractor/index.ts";
import {
  CommandLineExtractor,
  EnvExtractor,
  toFileExtractor,
} from "./extractor/index.ts";
import * as path from "https://deno.land/std/path/mod.ts";
import { getConfig } from "./getconfig.ts";

/**
 * Parameters for `auto`
 */
export interface AutoParams<C> {
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
  /**
   * Base configuration used as default values
   */
  baseConfig?: C;
}

/**
 * Creates a config object with sensible defaults
 *
 * 1. Uses `baseConfig` as default values
 * 2. Loads configuration files from `configDir`
 *   - Only files whose name matches the name parameter will be loaded
 *   - Analyzes the file extension to decide which extractor should be used
 *   - Yaml and Json are supported
 * 3. Loads environment variables
 *   - The prefix is `${name}_`
 *   - `_` is used as separator
 * 4. Loads command line arguments
 *
 * @param autoParams
 * @returns A configuration object
 */
export async function auto<C extends Record<PropertyKey, unknown>>(
  autoParams: AutoParams<C>,
): Promise<C> {
  const name = autoParams.name.toLowerCase();
  const dirname = autoParams.configDir ? autoParams.configDir : Deno.cwd();

  const regex = new RegExp(`${name}\\.\\w+`);

  const extractors = Array.from(Deno.readDirSync(dirname))
    // Only files
    .filter((entry) => entry.isFile)
    // Remove all files whose name isn't expected
    .filter((file) => file.name.toLowerCase().match(regex))
    // Join paths
    .map((file) => path.join(dirname, file.name))
    // Create extractors
    .map(toFileExtractor)
    // Remove null values (extractors couldn't be generated)
    .filter(Boolean) as Extractor<C>[];
  extractors.push(new EnvExtractor(`${name}_`));

  if (autoParams.baseConfig) {
    extractors.unshift(new DefaultExtractor(autoParams.baseConfig));
  }

  extractors.push(new CommandLineExtractor());

  const errorCallback = autoParams.errorCallback;
  return await getConfig<C>({ extractors, errorCallback });
}
