# Chimera

A fantastic configuration library for Deno

```ts
import { auto } from "https://deno.land/x/chimera/mod.ts";

// Define your expected configuration
interface Config {
  username: string;
  maxconn: number;
  nested: { foo: string };
  // More fields ...
}

// Let chimera handle environment variables, JSON, YAML and  command line
// arguments  for you!
const config: Config = await auto({ name: "example" });
console.log(config);
```

See the [documentation](https://doc.deno.land/https://deno.land/x/chimera) for
detailed usage

## Important note

The default branch moves fast and may contain breaking changes, always point
your import urls to a specific version. Check our
[GitHub releases page](https://github.com/Altair-Bueno/chimera/releases) to see
all available versions

## License

Licensed under the MIT license. See [LICENSE](LICENSE) for more information
