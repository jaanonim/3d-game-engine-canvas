import UiComponent from "../classes/Components/UiComponent";
import Color from "../utilities/math/Color";

export interface TextOptions {
    color?: Color;
    font?: string;
    fontSize?: number;
}

export default class Text extends UiComponent {
    private _text: string;
    private _options: TextOptions;

    constructor(text: string, options?: TextOptions) {
        super();
        this._text = text;
        this._options = {
            color: Color.black,
            font: "Arial",
            fontSize: 12,
            ...options,
        };
    }

    uiRender() {
        super.uiRender();
        const ctx = this.uiElement.canvas.ctx;
        ctx.font = `${this._options.fontSize}px ${this._options.font}`;
        ctx.fillStyle = this._options.color?.getStringRGBA() || "";
        ctx.textAlign = "center";
        ctx.fillText(
            this._text,
            this.uiElement.realSize.x / 2,
            this.uiElement.realSize.y / 2
        );
    }
}
