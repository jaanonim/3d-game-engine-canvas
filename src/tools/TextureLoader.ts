import Texture from "../utilities/Texture";
import VirtualCanvas from "../utilities/VirtualCanvas";

export default class TextureLoader {
    img: HTMLImageElement;

    constructor(img: HTMLImageElement) {
        this.img = img;
    }

    parse() {
        const vc = new VirtualCanvas(this.img.width, this.img.height);
        vc.ctx.drawImage(this.img, 0, 0);
        return new Texture(this.img.width, this.img.height, vc);
    }
}
