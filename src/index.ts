export {
  EnvExtractor,
  FileExtractor,
  JsonExtractor,
  YamlExtractor,
} from "./extractor/index.ts";

import type { Extractor } from "./extractor/index.ts";
import {
  EnvExtractor,
  JsonExtractor,
  YamlExtractor,
} from "./extractor/index.ts";
import { merge } from "lodash/lodash.js";
import { join, extname } from "path/mod.ts";

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

interface GetConfigParams<C> {
  extractors: Extractor<C>[];
  errorCallback?: (e?: Error) => void;
}

export async function getConfig<C>({
  extractors,
  errorCallback,
}: GetConfigParams<C>): Promise<C> {
  const promises = extractors.map(async (x) => {
    try {
      return await x.extract();
    } catch (e) {
      errorCallback && errorCallback(e);
      return {};
    }
  });
  const resolved = await Promise.all(promises);
  return merge(...resolved);
}

interface AutoParams {
  name: string;
  configDir?: string;
}

export async function auto<C>(autoParams: AutoParams):Promise<C> {
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
  return await getConfig<C>({ extractors });
}
