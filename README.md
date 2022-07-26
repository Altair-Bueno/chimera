# Chimera

A fantastic configuration library for Deno

```ts
import { auto } from "chimera";

interface Config {
  username: string;
  maxconn: number;
  nested: {
    foo: string;
  };
  // ...
}

const config: Config = await auto({ name: "example" });
console.log(config);
```

See the [documentation](example.org) for detailed usage
