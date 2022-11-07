import Texture from "../utilities/Texture";
import UiComponent from "../classes/Components/UiComponent";
import Color from "../utilities/math/Color";
import VirtualCanvas from "../utilities/VirtualCanvas";

export default class Image extends UiComponent {
    texture: Texture;
    color: Color;

    constructor(texture: Texture, color: Color = Color.white) {
        super();
        this.texture = texture;
        this.color = color;
    }

    uiRender() {
        super.uiRender();

        const c = new VirtualCanvas(
            this.texture.canvas.width,
            this.texture.canvas.height
        );

        c.ctx.fillStyle = this.color.getStringRGBA();
        c.ctx.fillRect(
            0,
            0,
            this.texture.canvas.width,
            this.texture.canvas.height
        );
        c.ctx.stroke();
        c.ctx.globalCompositeOperation = "destination-atop"; //? Hope it will work. It's randomly selected.
        c.ctx.drawImage(
            this.texture.canvas.canvas,
            0,
            0,
            this.texture.canvas.width,
            this.texture.canvas.height
        );

        this.uiElement.canvas.ctx.drawImage(
            c.canvas,
            0,
            0,
            c.canvas.width,
            c.canvas.height,
            0,
            0,
            this.uiElement.realSize.x,
            this.uiElement.realSize.y
        );
    }
}
