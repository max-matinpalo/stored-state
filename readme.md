# stored-state
[![npm version](https://img.shields.io/npm/v/stored-state)](https://www.npmjs.com/package/stored-state)
[![license](https://img.shields.io/github/license/max-matinpalo/stored-state)](https://github.com/max-matinpalo/stored-state/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/stored-state)](https://bundlephobia.com/package/stored-state)

**Simplest persistent state for browser apps**  
- Values are cached in memory and synced to localStorage
- Reads stay fast and data survive reloads.
- Looks like a normal object
- Zero setup

```js
import { state } from "stored-state";
state.user = { name: "peter" };
state.token = "123";
```

Data can be accessed and modified anywhere in your app.  
All writes auto sync to localStorage.


## install
Package size only ~250 bytes min+gzip
```bash
npm install stored-state
```



## Advantages
- Very simple: `state.name = value`
- Works like a plain object
- Lazy-loaded from localStorage
- Values cached in memory after first access
- No provider, no context, no setup
- Tiny: ~350 bytes min+gzip
- Zero dependencies


## License
MIT


### Hint for rebels 🙂
If you don't want manually import { state } from "stored-state" many times,  
you can just add this import at app start. 
```JS
import "stored-state/global"

// Now you can access STATE anywhere in your app without imports

STATE.user = {...}
```