import * as asserts from "https://deno.land/std/testing/asserts.ts";
import { auto } from "../mod.ts";

const RESOURCES_FOLDER = "test/resources";

Deno.test("`auto` expected behaviour", async () => {
  const expected = {
    env: "loaded",
    base: "loaded",
    "config.yaml": "loaded",
    "config.json": "loaded",
  };
  Deno.env.set("config_env", "loaded");
  const obtained: Partial<typeof expected> = await auto({
    name: "config",
    configDir: `${RESOURCES_FOLDER}/auto`,
    baseConfig: { base: "loaded" },
  });

  asserts.assertEquals(obtained, expected);
});

Deno.test("`auto` doesn't crash if directory does not exist", async () => {
  await auto({
    name: "test",
    configDir: "/tmp/foo/baz/doesntexist",
  });
});
