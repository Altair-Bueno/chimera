import { asserts } from "../../dev_deps.ts";
import { JsonExtractor, toFileExtractor, YamlExtractor } from "../../mod.ts";

Deno.test("toExtractor generates a Yaml extractor for .yml files", () => {
  const extractor = toFileExtractor("foo.yml");

  asserts.assertInstanceOf(extractor, YamlExtractor);
});

Deno.test("toExtractor generates a Yaml extractor for .yaml files", () => {
  const extractor = toFileExtractor("foo.yaml");

  asserts.assertInstanceOf(extractor, YamlExtractor);
});

Deno.test("toExtractor generates a json extractor for .json files", () => {
  const extractor = toFileExtractor("foo.json");

  asserts.assertInstanceOf(extractor, JsonExtractor);
});

Deno.test("toExtractor is case insensitive", () => {
  const extractor = toFileExtractor("foo.Json");

  asserts.assertExists(extractor);
});

Deno.test("toExtractor returns `null` for unknown file extensions", () => {
  const extractor = toFileExtractor("foo.unknown");

  asserts.assertEquals(extractor, null);
});

Deno.test("toExtractor returns `null` for files without file extensions", () => {
  const extractor = toFileExtractor("foo");

  asserts.assertEquals(extractor, null);
});
