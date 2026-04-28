# stored-state
[![npm version](https://img.shields.io/npm/v/stored-state)](https://www.npmjs.com/package/stored-state)
[![license](https://img.shields.io/github/license/max-matinpalo/stored-state?v=1)](https://github.com/max-matinpalo/stored-state/blob/main/LICENSE)

**Simplest persistent state for browser apps**  
- State cached in memory and synced to localStorage
- Fast reads and state survive reloads
- Zero setup, zero dependencies

```js
import { state } from "stored-state";
state.user = { name: "peter" };
state.token = "1234";
state.theme = "dark";
```

## Install
```bash
npm install stored-state
```

### Update State
Update state by assignment. Values can be any primitives, objects or arrays. 
Always assign top level keys, not nested fields.

```js
import { state } from "stored-state";
state.theme = "dark";
state.layout = {
	lastViewed: "analytics"...
};

// NOT do
state.user.lastViewed = ... 
```

### Read state
Read state like a normal object.
State can be accessed and modified anywhere in your app.
```js
import { state } from "stored-state";

console.log(state);
if (state.theme === "dark") ...
```

### Clear State
Clear single value. Two options:
```js
delete state.theme;
state.theme = null;
```
Clear whole state
```js
state.clear();
```


## Advantages
- **Simple:** `state.name = value`
- **Fast:** values cached in memory after first access
- **Small:** ~750 bytes min+gzip
- Zero setup, zero dependencies


## License
MIT


#### Hint
If you don't want manually `import { state } from "stored-state"` many times,  
you can just add this import at app start. 
```JS
import "stored-state/global"

// Now you can access STATE anywhere in your app without imports

STATE.user = {...}
```