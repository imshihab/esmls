/**
 * @type {Storage}
 */
const LOCAL__STORAGE: Storage = window.localStorage;
const observers: Record<string, (newValue: any) => void> = {};
let isOverridden = false;
let isStorageListenerAdded = false;

/**
 * @param {any} data
 */
function type(data: any): string {
    // @ts-ignore
    return Object.prototype.toString.call(data).match(/\[object (.*)\]/)[1];
}

/**
 * @param {string} error
 */
function throwError(error: string) {
    throw new Error(error);
}

/**
 * @param {string} key
 */
function isKey(key: string) {
    if (!key) return throwError("key is required");
    if (typeof key !== "string") return throwError("key must be string");
}

/**
 *  @param {string} key
 *  @param {any} data
 */
function setItem(key: string, data: any): void {
    isKey(key);
    LOCAL__STORAGE.setItem(
        key,
        JSON.stringify({
            type: type(data),
            data: data,
        })
    );
}

/**
 * Get data from `LocalStorage`
 * @param {string} key - The key to retrieve from localStorage
 * @param {Object} [options] - Optional configuration
 * @param {any} [options.default] - Default value to return if key doesn't exist
 * @param {boolean} [options.set] - If false, doesn't set the default value in storage
 * @param {boolean} [options.withSetter] - If true, returns tuple of [value, setter]
 * @returns {any | [any, (value: any) => void]} Single value or tuple with value and setter
 */
function getItem(
    key: string,
    options?: {
        default?: any;
        set?: boolean;
        withSetter?: boolean;
    }
): any | [any, (value: any) => void] {
    isKey(key);

    const getValue = () => {
        if (!hasItem(key)) {
            if (options?.default !== undefined) {
                if (options?.set !== false) setItem(key, options.default);
                return options.default;
            }
            return null;
        }

        // @ts-ignore
        const ReadStorage = JSON.parse(LOCAL__STORAGE.getItem(key));
        if (ReadStorage.type === "String") {
            return String(ReadStorage.data);
        } else if (ReadStorage.type === "Number") {
            return Number(ReadStorage.data);
        } else if (ReadStorage.type === "BigInt") {
            return BigInt(ReadStorage.data);
        } else if (ReadStorage.type === "Boolean") {
            return Boolean(ReadStorage.data);
        } else if (ReadStorage.type === "Date") {
            return new Date(ReadStorage.data);
        } else {
            return ReadStorage.data ? ReadStorage.data : ReadStorage;
        }
    };
    
    const setValue = (value: any | ((prevValue: any) => any)) => {
        const newValue =
            typeof value === "function" ? value(getValue()) : value;
        setItem(key, newValue);
        return newValue;
    };

    return options?.withSetter ? [getValue(), setValue] : getValue();
}

/**
 * @param {string} key - delete item from `LocalStorage`
 */
function delItem(key: string) {
    isKey(key);
    LOCAL__STORAGE.removeItem(key);
}

/**
 * @param {string} key - if `LocalStorage` has the item you're looking for..
 */
function hasItem(key: string) {
    isKey(key);
    return LOCAL__STORAGE.hasOwnProperty(key);
}

/**
 * Listen for changes to a localStorage key
 * @param {string} key - Key to observe
 * @param {(newValue: any) => void} callback - Callback when value changes
 */
function KeyonChange(key: string, callback: (newValue: any) => void) {
    isKey(key);
    observers[key] = callback;

    if (!isOverridden) {
        const originalSetItem = LOCAL__STORAGE.setItem.bind(LOCAL__STORAGE);
        const originalRemoveItem =
            LOCAL__STORAGE.removeItem.bind(LOCAL__STORAGE);

        LOCAL__STORAGE.setItem = function (k: string, value: string) {
            originalSetItem(k, value);
            if (observers[k]) {
                const parsedValue = getItem(k);
                observers[k](parsedValue);
            }
        };

        LOCAL__STORAGE.removeItem = function (k: string) {
            originalRemoveItem(k);
            if (observers[k]) {
                observers[k](null);
            }
        };

        isOverridden = true;
    }

    if (!isStorageListenerAdded) {
        window.addEventListener("storage", (event: StorageEvent) => {
            const changedKey = event.key;
            if (changedKey && observers[changedKey]) {
                const parsedValue = getItem(changedKey);
                observers[changedKey](parsedValue);
            }
        });
        isStorageListenerAdded = true;
    }

    // Return cleanup function
    return () => {
        delete observers[key];
    };
}

export const set = setItem;
export const get = getItem;
export const del = delItem;
export const has = hasItem;
export const onChange = KeyonChange;

export default {
    set,
    get,
    del,
    has,
    onChange,
};
