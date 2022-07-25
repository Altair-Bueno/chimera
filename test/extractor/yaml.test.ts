import { assertEquals } from "test/asserts.ts";
import { YamlExtractor } from "../../mod.ts";

const RESOURCES_FOLDER = "test/resources";

Deno.test("Load valid Yaml object from file", async () => {
  const expected = {
    config: "Hello world",
  };
  const filename = `${RESOURCES_FOLDER}/config.yml`;
  const extractor = new YamlExtractor<typeof expected>(filename);
  const obtained = await extractor.extract();

  assertEquals(obtained, expected);
});
