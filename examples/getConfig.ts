/**
 * Sample usage of `getConfig`
 *
 * Use `deno run --allow-read examples/getConfig.ts` from the root
 * directory to run this example
 */

import { getConfig, JsonExtractor, YamlExtractor } from "/mod.ts";

interface Config {
  hostname: string;
  authentication: {
    type: string;
    expires: number;
  };
}

// Extractors used to generate the configuration object. The first extractor
// runs first and is merged with the rest in order. In this case, `config.json`
// will take preference over `config.yaml`
const extractors = [
  new YamlExtractor<Config>("examples/config.yaml"),
  new JsonExtractor<Config>("examples/config.json"),
];

// This callback will execute for each exception thrown by the extractors

const errorCallback = (e: Error) =>
  console.error(`Missing one config file!: ${e.message}`);
const config = await getConfig<Config>({ extractors, errorCallback });

console.log(config);
