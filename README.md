# Chimera

Configuration made easy

## Usage

```ts
import { auto } from 'chimera'

interface Config {
  username: string
}

const config = await auto({name: "example"})
console.log(config)
```