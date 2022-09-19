import { clamp, map } from "./Math";

export default class Color {
    r: number;
    g: number;
    b: number;
    a: number;

    static red = new Color(255, 0, 0, 255);
    static green = new Color(0, 255, 0, 255);
    static blue = new Color(0, 0, 255, 255);
    static white = new Color(255, 255, 255, 255);
    static black = new Color(0, 0, 0, 255);

    static random() {
        return new Color(
            Math.round((Math.random() * 255) / 25) * 25,
            Math.round((Math.random() * 255) / 25) * 25,
            Math.round((Math.random() * 255) / 25) * 25,
            255
        );
    }

    constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 255) {
        this.r = clamp(r, 0, 255);
        this.g = clamp(g, 0, 255);
        this.b = clamp(b, 0, 255);
        this.a = clamp(a, 0, 255);
    }

    verifyValue(v: number) {
        return v <= 255 && v >= 0;
    }

    _valueToHex(v: number) {
        var hex = v.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    getHex() {
        return (
            "#" +
            this._valueToHex(this.r) +
            this._valueToHex(this.g) +
            this._valueToHex(this.b)
        );
    }

    getStringRGBA() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }

    copy() {
        return new Color(this.r, this.g, this.b, this.a);
    }

    multiply(v: number | Color) {
        if (v instanceof Color) {
            const r = this.r * v.r;
            const g = this.g * v.g;
            const b = this.b * v.b;

            const maxV = Math.max(r, g, b, 255);

            return new Color(
                map(r, 0, maxV, 0, 255),
                map(g, 0, maxV, 0, 255),
                map(b, 0, maxV, 0, 255),
                this.a
            );
        } else return new Color(this.r * v, this.g * v, this.b * v, this.a);
    }

    normalize() {
        return new Color(
            this.r / 255,
            this.g / 255,
            this.b / 255,
            this.a / 255
        );
    }

    add(c: Color) {
        return new Color(this.r + c.r, this.g + c.g, this.b + c.b, this.a);
    }
}
