# Chimera

Chimera is a configuration framework so unreal that feels fictional

## Usage

```ts
import { auto } from 'chimera'

interface Config {
  username: string
}

const config = await auto({name: "example"})
console.log(config)
```