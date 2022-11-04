export default class FileLoader {
    static fileCache: { [key: string]: string } = {};
    static imageCache: { [key: string]: HTMLImageElement } = {};

    static async load(url: string, useCache = true) {
        if (useCache) {
            const c = this.fileCache[url];
            if (c) return c;
        }
        const res = await fetch(url);
        if (res.status === 0 || res.status === 200) {
            const text = await res.text();
            if (useCache) this.fileCache[url] = text;
            return text;
        } else throw Error(`Cannot get file at ${url}`);
    }

    static loadImg(url: string, useCache = true): Promise<HTMLImageElement> {
        if (useCache) {
            const c = this.imageCache[url];
            if (c)
                return new Promise((res, _rej) => {
                    res(c);
                });
        }
        return new Promise((res, _rej) => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
                if (useCache) this.imageCache[url] = img;
                res(img);
            };
        });
    }
}
