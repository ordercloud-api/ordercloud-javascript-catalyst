import NodeCache from "node-cache";

// This file is full of things I don't want the library to export.

const cache = new NodeCache({
    deleteOnExpire: true,
});

export async function GetOrAddToCache<T>(key: string, timeToLiveSeconds: number, addItemFunc: () => T | Promise<T>): Promise<T> {
    let object = cache.get(key) as T;
    if (!object) {
        object = await addItemFunc();
        cache.set(key, object, timeToLiveSeconds);
    } 
    return object;
}

export function getHeader(req, headerName: string): string | null {
    var header = req.headers[headerName];
    return Array.isArray(header) ? header[0]: header;
}

export function throwError(error: Error, next: Function) {
    if (next) {
        next(error)
    } else {
        throw error;
    }
}
  