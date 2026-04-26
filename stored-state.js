const mem = Object.create(null);
const PREFIX = "ss:";

const storage = (() => {
	try { return globalThis.localStorage; }
	catch (err) { console.error("localStorage not available:", err); return null; }
})();

function readStorage(key) {
	// Ensure null return for SSR/missing storage
	if (!storage) return null;

	try { return storage.getItem(PREFIX + key); }
	catch { return null; }
}

function writeStorage(key, val) {
	try { storage?.setItem(PREFIX + key, val); }
	catch (err) { console.error("Storage write failed:", err); }
}

function removeStorage(key) {
	try { storage?.removeItem(PREFIX + key); }
	catch { }
}

function parse(val) {
	try { return JSON.parse(val); }
	catch { return val; }
}

export const state = new Proxy({}, {
	get: function (target, key) {
		// 1. Return if symbol or cached
		if (typeof key === "symbol") return target[key];
		if (key in mem) return mem[key];

		// 2. Fetch from storage
		const raw = readStorage(key);
		if (raw === null) return undefined;

		// 3. Cache result
		mem[key] = parse(raw);
		return mem[key];
	},

	set: function (target, key, val) {
		// 1. Remove if undefined
		if (val === undefined) {
			delete mem[key];
			removeStorage(key);
			return true;
		}

		// 2. Serialize value
		let raw;
		try { raw = JSON.stringify(val); }
		catch (err) { console.error("Value not serializable:", err); return false; }

		if (raw === undefined) {
			console.error("Value not serializable");
			return false;
		}

		// 3. Update memory and storage
		mem[key] = val;
		writeStorage(key, raw);
		return true;
	},

	deleteProperty: function (target, key) {
		delete mem[key];
		removeStorage(key);
		return true;
	},

	has: function (target, key) {
		if (typeof key === "symbol") return key in target;
		if (key in mem) return true;
		return readStorage(key) !== null;
	},

	// ownKeys and getOwnPropertyDescriptor allow Object.keys(), JSON.stringify(), 
	// and the spread operator to see both cached and persistent keys.
	ownKeys: function (target) {
		// 1. Collect memory keys
		const keys = new Set(Object.keys(mem));

		// 2. Collect storage keys
		const len = storage?.length || 0;
		for (let i = 0; i < len; i++) {
			const k = storage.key(i);
			if (k?.startsWith(PREFIX)) keys.add(k.slice(PREFIX.length));
		}

		return Array.from(keys);
	},

	getOwnPropertyDescriptor: function (target, key) {
		// 1. Validate existence
		if (typeof key === "symbol") return undefined;
		if (!(key in mem) && readStorage(key) === null) return undefined;

		return { enumerable: true, configurable: true };
	}
});

// Sync changes from other tabs/windows to keep the memory cache fresh.
if (globalThis.addEventListener) {
	globalThis.addEventListener("storage", e => {
		// 1. Filter unrelated events
		if (!e.key?.startsWith(PREFIX)) return;

		// 2. Extract key
		const key = e.key.slice(PREFIX.length);
		if (!(key in mem)) return;

		// 3. Update cache
		if (e.newValue === null) {
			delete mem[key];
			return;
		}

		mem[key] = parse(e.newValue);
	});
}