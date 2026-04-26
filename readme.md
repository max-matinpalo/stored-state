# stored-state
[![npm version](https://img.shields.io/npm/v/stored-state)](https://www.npmjs.com/package/stored-state)
[![license](https://img.shields.io/github/license/max-matinpalo/stored-state?v=1)](https://github.com/max-matinpalo/stored-state/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/stored-state?v=1)](https://bundlephobia.com/package/stored-state)
[![Socket Badge](https://socket.dev/api/badge/npm/package/stored-state)](https://socket.dev/npm/package/stored-state)

**Simplest persistent state for browser apps**  
- Values are cached in memory and synced to localStorage
- Reads stay fast and data survive reloads
- Looks like a normal object
- Zero setup

```js
import { state } from "stored-state";
state.user = { name: "peter" };
state.token = "123";
```

State can be accessed and modified anywhere in your app.  
All writes auto sync to localStorage.


## install
```bash
npm install stored-state
```




## Advantages
- Very simple: `state.name = value`
- Lazy-loaded from localStorage
- Values cached in memory after first access
- No provider, no context, no setup
- Small: ~650 bytes min+gzip
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