const mem = {};
const PREFIX = "ss:";
const storage = globalThis.localStorage;

export const state = new Proxy({}, {
	get: function (target, key) {
		// 1. Ignore symbols or internal proxy lookups
		if (typeof key === "symbol") return target[key];

		// 2. Return from memory if already loaded
		if (key in mem) return mem[key];

		// 3. Fallback to undefined if in SSR environment
		if (!storage) return mem[key] = undefined;

		// 4. Check storage using prefix
		const raw = storage.getItem(PREFIX + key);
		if (raw === null) return mem[key] = undefined;

		// 5. Parse and cache for future use
		try {
			mem[key] = JSON.parse(raw);
		} catch (e) {
			mem[key] = raw;
		}

		return mem[key];
	},

	set: function (target, key, val) {
		// 1. Update memory cache
		mem[key] = val;

		// 2. Skip disk access in SSR environments
		if (!storage) return true;

		// 3. Handle deletion via undefined
		if (val === undefined) {
			storage.removeItem(PREFIX + key);
			return true;
		}

		// 4. Persist to storage with prefix
		storage.setItem(PREFIX + key, JSON.stringify(val));
		return true;
	},

	deleteProperty: function (target, key) {
		// 1. Remove from memory
		delete mem[key];

		// 2. Remove from storage if available
		if (storage) storage.removeItem(PREFIX + key);
		return true;
	}
});

// 1. Safe storage listener for multi-tab sync
if (globalThis.addEventListener) {
	globalThis.addEventListener("storage", e => {
		// 2. Ignore unrelated keys
		if (!e.key?.startsWith(PREFIX)) return;

		const key = e.key.slice(PREFIX.length);
		if (!(key in mem)) return;

		// 3. Handle deletion from another tab
		if (!e.newValue) {
			mem[key] = undefined;
			return;
		}

		// 4. Parse safely to avoid crashes
		try {
			mem[key] = JSON.parse(e.newValue);
		} catch (err) {
			mem[key] = e.newValue;
		}
	});
}