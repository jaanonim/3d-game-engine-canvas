export default class FileLoader {
    static async load(url: string) {
        const res = await fetch(url);
        if (res.status === 0 || res.status === 200) return await res.text();
        else throw Error(`Cannot get file at ${url}`);
    }

    static loadImg(url: string): Promise<HTMLImageElement> {
        return new Promise((res, rej) => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
                res(img);
            };
        });
    }
}
