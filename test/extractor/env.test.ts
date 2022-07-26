import { assertEquals } from "test/asserts.ts";
import { EnvExtractor } from "/mod.ts";

Deno.test(
  "Ignores environment variables that do not contain a given prefix",
  async () => {
    const prefix = "test_prefix_";
    const expected = { withprefix: "loaded" };

    const extractor = new EnvExtractor<typeof expected>(prefix);
    Deno.env.set("example", "hello");
    Deno.env.set(`${prefix}withprefix`, "loaded");

    const obtainted = await extractor.extract();

    assertEquals(obtainted, expected);
  },
);

Deno.test("Loads nested properties", async () => {
  const prefix = "test_nested_";
  const extractor = new EnvExtractor<typeof expected>(prefix);
  const expected = { nested: { property: "secret" } };
  Deno.env.set(`${prefix}NESTED_PROPERTY`, "secret");

  const obtainted = await extractor.extract();

  assertEquals(obtainted, expected);
});

Deno.test("Loads multiple properties from nested objects", async () => {
  const prefix = "test_multiple_nested";
  const expected = {
    first: {
      second: {
        hello: "world",
        another: "property",
      },
      nested: "here",
    },
    nonest: "Not nested",
  };

  const extractor = new EnvExtractor<typeof expected>(prefix);
  Deno.env.set(`${prefix}FIRST_SECOND_HELLO`, "world");
  Deno.env.set(`${prefix}FIRST_SECOND_ANOTHER`, "property");
  Deno.env.set(`${prefix}FIRST_NESTED`, "here");
  Deno.env.set(`${prefix}NONEST`, "Not nested");

  const obtainted = await extractor.extract();

  assertEquals(obtainted, expected);
});

Deno.test("Loads valid JSON as objects", async () => {
  const prefix = "test_json_values";
  const expected = {
    config: { loaded: true, content: null },
  };
  const extractor = new EnvExtractor<typeof expected>(prefix);
  Deno.env.set(`${prefix}config`, JSON.stringify(expected.config));

  const obtainted = await extractor.extract();

  assertEquals(obtainted, expected);
});

Deno.test("Empty environment creates empty object", async () => {
  const prefix = "test_empty";
  const expected = {};
  const extractor = new EnvExtractor<typeof expected>(prefix);

  const obtained = await extractor.extract();

  assertEquals(obtained, expected);
});
