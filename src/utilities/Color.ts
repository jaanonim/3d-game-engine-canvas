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
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;

        if (!this.verify()) {
            console.error(this);
            throw Error(`Invalid color values`);
        }
    }

    verify() {
        return (
            this.verifyValue(this.r) &&
            this.verifyValue(this.g) &&
            this.verifyValue(this.b) &&
            this.verifyValue(this.a)
        );
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
                clamp(map(r, 0, maxV, 0, 255), 0, 255),
                clamp(map(g, 0, maxV, 0, 255), 0, 255),
                clamp(map(b, 0, maxV, 0, 255), 0, 255),
                this.a
            );
        } else
            return new Color(
                clamp(this.r * v, 0, 255),
                clamp(this.g * v, 0, 255),
                clamp(this.b * v, 0, 255),
                this.a
            );
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
        return new Color(
            clamp(this.r + c.r, 0, 255),
            clamp(this.g + c.g, 0, 255),
            clamp(this.b + c.b, 0, 255),
            this.a
        );
    }
}
