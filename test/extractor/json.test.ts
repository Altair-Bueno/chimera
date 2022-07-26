import { assertEquals } from "test/asserts.ts";
import { JsonExtractor } from "/mod.ts";

const RESOURCES_FOLDER = "test/resources";

Deno.test("Load valid JSON object from file", async () => {
  const expected = {
    config: "Hello world",
  };
  const filename = `${RESOURCES_FOLDER}/config.json`;
  const jsonExtractor = new JsonExtractor<typeof expected>(filename);
  const obtained = await jsonExtractor.extract();

  assertEquals(obtained, expected);
});
