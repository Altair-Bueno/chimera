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

// Let chimera handle environment variables, JSON and YAML for you
const config: Config = await auto({ name: "example" });
console.log(config);
```

See the [documentation](https://doc.deno.land/https://deno.land/x/chimera) 
for detailed usage
