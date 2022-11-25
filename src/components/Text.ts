import { PositionType } from "../classes/Components/SizedComponent";
import UiComponent from "../classes/Components/UiComponent";
import Color from "../utilities/math/Color";

export interface TextOptions {
    color?: Color;
    font?: string;
    fontSize?: number;
    textAlign?: PositionType;
    lineHeight?: number;
}

export interface TextOptionsAll {
    color: Color;
    font: string;
    fontSize: number;
    textAlign: PositionType;
    lineHeight: number;
}

export default class Text extends UiComponent {
    private _text: string;
    public get text(): string {
        return this._text;
    }
    public set text(value: string) {
        this._text = value;
    }

    private _options: TextOptionsAll;
    public get options(): TextOptionsAll {
        return this._options;
    }

    constructor(text: string, options?: TextOptions) {
        super();
        this._text = text;
        this._options = {
            color: Color.black,
            font: "Arial",
            fontSize: 12,
            textAlign: PositionType.CENTER_CENTER,
            lineHeight: 4,
            ...options,
        };
    }

    uiRender() {
        super.uiRender();
        const ctx = this.uiElement.canvas.ctx;
        ctx.font = `${this._options.fontSize}px ${this._options.font}`;
        ctx.fillStyle = this._options.color.getStringRGBA();

        const texts = this._text.split("\n");
        const yMove = this._options.fontSize + this._options.lineHeight;

        let x: number, y: number;

        switch (this._options.textAlign) {
            case PositionType.TOP_LEFT:
                ctx.textAlign = "left";
                x = 0;
                y = yMove;
                break;
            case PositionType.TOP_CENTER:
                ctx.textAlign = "center";
                x = this.uiElement.realSize.x / 2;
                y = yMove;
                break;
            case PositionType.TOP_RIGHT:
                ctx.textAlign = "right";
                x = this.uiElement.realSize.x;
                y = yMove;
                break;
            case PositionType.CENTER_LEFT:
                ctx.textAlign = "left";
                x = 0;
                y =
                    (this.uiElement.realSize.y - (texts.length - 2) * yMove) /
                    2;
                break;
            case PositionType.CENTER_CENTER:
                x = this.uiElement.realSize.x / 2;
                y =
                    (this.uiElement.realSize.y - (texts.length - 2) * yMove) /
                    2;
                ctx.textAlign = "center";
                break;
            case PositionType.CENTER_RIGHT:
                ctx.textAlign = "right";
                x = this.uiElement.realSize.x;
                y =
                    (this.uiElement.realSize.y - (texts.length - 2) * yMove) /
                    2;
                break;
            case PositionType.BOTTOM_LEFT:
                ctx.textAlign = "left";
                x = 0;
                y = this.uiElement.realSize.y + (1 - texts.length) * yMove;
                break;
            case PositionType.BOTTOM_CENTER:
                ctx.textAlign = "center";
                x = this.uiElement.realSize.x / 2;
                y = this.uiElement.realSize.y + (1 - texts.length) * yMove;
                break;
            case PositionType.BOTTOM_RIGHT:
                ctx.textAlign = "right";
                x = this.uiElement.realSize.x;
                y = this.uiElement.realSize.y + (1 - texts.length) * yMove;
                break;
        }

        texts.forEach((t) => {
            ctx.fillText(t, x, y);
            y += yMove;
        });
    }
}
