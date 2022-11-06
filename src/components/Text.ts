import UiComponent from "../classes/Components/UiComponent";
import Color from "../utilities/math/Color";

export interface TextOptions {
    color?: Color;
    font?: string;
    fontSize?: number;
    textAlign?: "center" | "left" | "right";
}

export default class Text extends UiComponent {
    private _text: string;
    public get text(): string {
        return this._text;
    }
    public set text(value: string) {
        this._text = value;
    }

    private _options: TextOptions;
    public get options(): TextOptions {
        return this._options;
    }
    public set options(value: TextOptions) {
        this._options = value;
    }

    constructor(text: string, options?: TextOptions) {
        super();
        this._text = text;
        this._options = {
            color: Color.black,
            font: "Arial",
            fontSize: 12,
            textAlign: "center",
            ...options,
        };
    }

    uiRender() {
        super.uiRender();
        const ctx = this.uiElement.canvas.ctx;
        ctx.font = `${this._options.fontSize}px ${this._options.font}`;
        ctx.fillStyle = this._options.color?.getStringRGBA() || "";
        ctx.textAlign = this._options.textAlign || "center";

        switch (this._options.textAlign) {
            case "center":
                ctx.fillText(
                    this._text,
                    this.uiElement.realSize.x / 2,
                    this.uiElement.realSize.y / 2
                );
                break;
            case "left":
                ctx.fillText(this._text, 0, this.uiElement.realSize.y / 2);
                break;
            case "right":
                ctx.fillText(
                    this._text,
                    this.uiElement.realSize.x,
                    this.uiElement.realSize.y / 2
                );
                break;
        }
    }
}
