import { DefaultExtractor } from "./extractor/index.ts";
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
  const extractors = [];
  if (autoParams.baseConfig) {
    extractors.push(new DefaultExtractor<C>(autoParams.baseConfig));
  }

  const name = autoParams.name.toLowerCase();
  const dirname = autoParams.configDir ? autoParams.configDir : Deno.cwd();
  const regex = new RegExp(`${name}\\.\\w+`);

  try {
    for await (const entry of Deno.readDir(dirname)) {
      if (!entry.isFile || !entry.name.toLowerCase().match(regex)) {
        continue;
      }
      const fileExtractor = toFileExtractor<C>(path.join(dirname, entry.name));
      if (fileExtractor) {
        extractors.push(fileExtractor);
      }
    }
  } catch (e) {
    autoParams.errorCallback && autoParams.errorCallback(e);
  }

  extractors.push(
    new EnvExtractor<C>(`${name}_`),
    new CommandLineExtractor<C>(),
  );

  const { errorCallback } = autoParams;
  return await getConfig<C>({ extractors, errorCallback });
}
