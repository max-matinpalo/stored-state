// 1. Private memory cache
const mem = {};

export const state = new Proxy({}, {
	get: function (target, key) {
		// 1. Return from memory if already loaded
		if (key in mem) return mem[key];

		// 2. Check disk only if not in memory
		const raw = localStorage.getItem(key);

		// 3. Cache undefined for missing keys to avoid repeated disk hits
		if (raw === null) return mem[key] = undefined;

		// 4. Parse and cache for future use
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

		// 2. Handle deletion from storage
		if (val === undefined) {
			localStorage.removeItem(key);
			return true;
		}

		// 3. Persist to localStorage
		const s = typeof val === "string" ? val : JSON.stringify(val);
		localStorage.setItem(key, s);
		return true;
	}
});