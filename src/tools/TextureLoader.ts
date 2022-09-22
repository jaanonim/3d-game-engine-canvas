import Color from "../utilities/math/Color";
import Texture from "../utilities/Texture";

export default class TextureLoader {
    img: HTMLImageElement;

    constructor(img: HTMLImageElement) {
        this.img = img;
    }

    parse() {
        const canvas = document.createElement("canvas");
        canvas.width = this.img.width;
        canvas.height = this.img.height;
        const ctx = canvas.getContext("2d");
        if (ctx == null) throw Error("Something went wrong in TextureLoader");
        ctx.drawImage(this.img, 0, 0);
        const data = ctx.getImageData(
            0,
            0,
            this.img.width,
            this.img.height
        ).data;
        const colors = [];
        for (let i = 0; i < data.length; i += 4) {
            colors.push(
                new Color(data[i], data[i + 1], data[i + 2], data[i + 3])
            );
        }

        return new Texture(this.img.width, this.img.height, colors);
    }
}
