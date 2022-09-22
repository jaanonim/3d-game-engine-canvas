import Color from "./math/Color";

export default class Texture {
    colors: Array<Color>;
    width: number;
    height: number;

    constructor(width: number, height: number, colors: Array<Color>) {
        this.colors = colors;
        this.width = width;
        this.height = height;
    }

    get(x: number, y: number): Color {
        const realX = Math.round(this.width * x);
        const realY = Math.round(this.height * y);

        return this.colors[realY * this.width + realX];
    }
}
