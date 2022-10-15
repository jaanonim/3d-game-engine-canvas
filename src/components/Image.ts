import Texture from "../utilities/Texture";
import UiComponent from "../classes/Components/UiComponent";

export default class Image extends UiComponent {
    texture: Texture;

    constructor(texture: Texture) {
        super();
        this.texture = texture;
    }

    uiRender() {
        super.uiRender();
        this.uiElement.canvas.ctx.drawImage(
            this.texture.canvas.canvas,
            0,
            0,
            this.uiElement.realSize.x,
            this.uiElement.realSize.y
        );
    }
}
