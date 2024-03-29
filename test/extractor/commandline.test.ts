import * as asserts from "https://deno.land/std/testing/asserts.ts";
import { CommandLineExtractor } from "../../mod.ts";

Deno.test("Empty argument list creates an empty object", async () => {
  const extractor = new CommandLineExtractor([]);

  const expected = {};
  const obtained = await extractor.extract();

  asserts.assertEquals(obtained, expected);
});
