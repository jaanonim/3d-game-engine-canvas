import Component from "../classes/Component";
import Renderer from "../classes/Renderer";

/**
 * @deprecated
 */
export default class SpriteRenderer extends Component {
    private _sprite: HTMLImageElement;

    public get sprite(): HTMLImageElement {
        return this._sprite;
    }
    public set sprite(value: HTMLImageElement) {
        this._sprite = value;
    }

    constructor() {
        super();
        this._sprite = new Image(0, 0);
    }

    render(renderer: Renderer) {
        //     let pos = this.gameObject.getWordPosition();
        //     let scale = this.gameObject.getWordScale();
        //     renderer.ctx.drawImage(
        //         this._sprite,
        //         pos.x - (this._sprite.naturalWidth * scale.x) / 2,
        //         pos.y - (this._sprite.naturalHeight * scale.y) / 2,
        //         this._sprite.naturalWidth * scale.x,
        //         this._sprite.naturalHeight * scale.y
        //     );
    }
}
