const mem = Object.create(null);
const PREFIX = "ss:";

const storage = (() => {
	try {
		return globalThis.localStorage;
	} catch (err) {
		console.error("localStorage not available:", err);
		return null;
	}
})();

function readStorage(key) {
	try {
		return storage?.getItem(PREFIX + key);
	} catch {
		return null;
	}
}

function writeStorage(key, val) {
	try {
		storage?.setItem(PREFIX + key, val);
	} catch (err) {
		console.error("Storage write failed:", err);
	}
}

function removeStorage(key) {
	try {
		storage?.removeItem(PREFIX + key);
	} catch { }
}

function parse(val) {
	try {
		return JSON.parse(val);
	} catch {
		return val;
	}
}

export const state = new Proxy({}, {
	get: function (target, key) {
		if (typeof key === "symbol") return target[key];
		if (key in mem) return mem[key];

		const raw = readStorage(key);
		if (raw === null) return mem[key] = undefined;

		return mem[key] = parse(raw);
	},

	set: function (target, key, val) {
		if (val === undefined) {
			delete mem[key];
			removeStorage(key);
			return true;
		}

		let raw;
		try {
			raw = JSON.stringify(val);
		} catch (err) {
			console.error("Value not serializable:", err);
			return false;
		}

		mem[key] = val;
		writeStorage(key, raw);
		return true;
	},

	deleteProperty: function (target, key) {
		delete mem[key];
		removeStorage(key);
		return true;
	},

	ownKeys: function (target) {
		return Object.keys(mem);
	},

	getOwnPropertyDescriptor: function (target, key) {
		return { enumerable: true, configurable: true };
	}
});

if (globalThis.addEventListener) {
	globalThis.addEventListener("storage", e => {
		if (!e.key?.startsWith(PREFIX)) return;

		const key = e.key.slice(PREFIX.length);
		if (!(key in mem)) return;

		if (!e.newValue) {
			delete mem[key];
			return;
		}

		mem[key] = parse(e.newValue);
	});
}