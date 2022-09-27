import Color from "./math/Color";
import { clamp } from "./math/Math";

export default class Texture {
    colorsData: Uint8ClampedArray;
    width: number;
    height: number;
    widthX4: number;
    bilinearFiltering: boolean;

    constructor(width: number, height: number, colorsData: Uint8ClampedArray) {
        this.colorsData = colorsData;
        this.width = width;
        this.height = height;
        this.widthX4 = 4 * this.width;
        this.bilinearFiltering = true;
    }

    get(x: number, y: number): Color {
        const realX = (this.width - 1) * x;
        const realY = (this.height - 1) * y;
        return this.filter(realX, realY);
    }

    filter(x: number, y: number): Color {
        const realX = Math.floor(x);
        const realY = Math.floor(y);
        if (!this.bilinearFiltering) return this.getColor(realX, realY);

        const fracX = x - realX;
        const fracY = y - realY;

        const TL = this.getColor(realX, realY);
        const TR = this.getColor(realX + 1, realY);
        const BL = this.getColor(realX, realY + 1);
        const BR = this.getColor(realX + 1, realY + 1);

        const CT = TR.multiply(fracX).add(TL.multiply(1 - fracX));
        const CB = BR.multiply(fracX).add(BL.multiply(1 - fracX));
        return CB.multiply(fracY).add(CT.multiply(1 - fracY));
    }

    getColor(x: number, y: number) {
        x = clamp(x, 0, this.width - 1);
        y = clamp(y, 0, this.height - 1);

        const start = y * this.widthX4 + x * 4;

        return new Color(
            this.colorsData[start],
            this.colorsData[start + 1],
            this.colorsData[start + 2],
            this.colorsData[start + 3]
        );
    }
}
