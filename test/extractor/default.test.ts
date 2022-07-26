import { DefaultExtractor } from "../../mod.ts";
import { asserts } from "../../deps.ts";

Deno.test("Extract returns the same object", async () => {
  const expected = { hello: "world", this: 10 };
  const extractor = new DefaultExtractor(expected);

  const obtained = await extractor.extract();

  asserts.assertEquals(obtained, expected);
});
