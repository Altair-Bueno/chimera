import { asserts } from "../deps.ts";
import { auto } from "../mod.ts";

const RESOURCES_FOLDER = "test/resources";

Deno.test("`auto` expected behaviour", async () => {
  const expected = {
    "env": "loaded",
    "base": "loaded",
    "config.yaml": "loaded",
    "config.json": "loaded",
  };
  Deno.env.set("config_env", "loaded");
  const obtained: Partial<typeof expected> = await auto({
    name: "config",
    configDir: `${RESOURCES_FOLDER}/auto`,
    baseConfig: { "base": "loaded" },
  });

  asserts.assertEquals(obtained, expected);
});
