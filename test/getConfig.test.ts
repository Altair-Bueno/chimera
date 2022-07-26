import { asserts } from "../deps.ts";
import { DefaultExtractor, getConfig } from "../mod.ts";

Deno.test("Empty extractor list returns empty object", async () => {
  const expected = {};
  const obtained = await getConfig({ extractors: [] });

  asserts.assertEquals(obtained, expected);
});

Deno.test("Last extractor takes preference", async () => {
  const first = new DefaultExtractor({ hello: "world" });
  const second = new DefaultExtractor({ hello: "people" });

  const expected = { hello: "people" };
  const obtained = await getConfig({ extractors: [first, second] });

  asserts.assertEquals(obtained, expected);
});

Deno.test("Error callback executes on each extractor failure", async () => {
  const extractor = {
    extract: () => {
      throw new Error();
    },
  };

  let count = 0;

  await getConfig({
    extractors: [extractor, extractor],
    errorCallback: () => count++,
  });

  asserts.assertEquals(count, 2);
});
