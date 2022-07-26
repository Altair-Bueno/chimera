import { DefaultExtractor } from "../../mod.ts";
import { assertEquals } from "test/asserts.ts";

Deno.test("Extract returns the same object", async () => {
  const expected = { hello: "world", this: 10 };
  const extractor = new DefaultExtractor(expected);

  const obtained = await extractor.extract();

  assertEquals(obtained, expected);
});
