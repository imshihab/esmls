/**
 * @type {Storage}
 */
const LOCAL__STORAGE: Storage = window.localStorage;
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
 * @param {string} key - get data from `LocalStorage`
 * @param {any} defitem - pass a default item if there is no item in `LocalStorage`
 */
function getItem(key: string, defitem?: any): any {
    isKey(key);
    if (!hasItem(key)) {
        return defitem ? defitem : null;
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

export const set = setItem;
export const get = getItem;
export const del = delItem;
export const has = hasItem;

export default {
    set,
    get,
    del,
    has
};