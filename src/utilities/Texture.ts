import Color from "./math/Color";
import { clamp } from "./math/Math";
import VirtualCanvas from "./VirtualCanvas";

export default class Texture {
    colorsData: Array<Uint8ClampedArray>;
    width: Array<number>;
    height: Array<number>;
    bilinearFiltering: boolean;
    canvas: VirtualCanvas;

    constructor(width: number, height: number, canvas: VirtualCanvas) {
        this.width = [width];
        this.height = [height];
        this.bilinearFiltering = true;
        this.canvas = canvas;
        this.colorsData = [
            this.canvas.ctx.getImageData(0, 0, this.width[0], this.height[0])
                .data,
        ];
        this.generateMipmap(this.calculateDepth());
    }

    get(x: number, y: number, textureId: number = 0): Color {
        const realX = (this.width[textureId] - 1) * x;
        const realY = (this.height[textureId] - 1) * y;
        return this.filter(realX, realY, textureId);
    }

    filter(x: number, y: number, textureId: number): Color {
        const realX = Math.floor(x);
        const realY = Math.floor(y);
        if (!this.bilinearFiltering)
            return this.getColor(realX, realY, textureId);

        const fracX = x - realX;
        const fracY = y - realY;

        const TL = this.getColor(realX, realY, textureId);
        const TR = this.getColor(realX + 1, realY, textureId);
        const BL = this.getColor(realX, realY + 1, textureId);
        const BR = this.getColor(realX + 1, realY + 1, textureId);

        const CT = TR.multiply(fracX).add(TL.multiply(1 - fracX));
        const CB = BR.multiply(fracX).add(BL.multiply(1 - fracX));
        return CB.multiply(fracY).add(CT.multiply(1 - fracY));
    }

    getColor(x: number, y: number, textureId: number) {
        x = clamp(x, 0, this.width[textureId] - 1);
        y = clamp(y, 0, this.height[textureId] - 1);

        const start = y * this.width[textureId] * 4 + x * 4;

        return new Color(
            this.colorsData[textureId][start],
            this.colorsData[textureId][start + 1],
            this.colorsData[textureId][start + 2],
            this.colorsData[textureId][start + 3]
        );
    }

    /**
     * Calculate depth for mipmap creation.
     * @returns depth number
     */
    calculateDepth() {
        let size = Math.min(this.width[0], this.height[0]);
        let depth = 0;
        while (size > 1) {
            size = Math.round(size / 2);
            depth++;
        }
        depth--;
        return depth;
    }

    generateMipmap(depth: number) {
        for (let i = 1; i < depth; i++) {
            this.width[i] = Math.round(this.width[i - 1] / 2);
            this.height[i] = Math.round(this.height[i - 1] / 2);

            this.colorsData[i] = new Uint8ClampedArray(
                this.width[i] * this.height[i] * 4
            );
            for (let x = 0; x < this.width[i]; x++) {
                for (let y = 0; y < this.height[i]; y++) {
                    for (let c = 0; c < 4; c++) {
                        const pos = (y * this.width[i] + x) * 4 + c;
                        const value =
                            this.colorsData[i - 1][
                                (y * 2 * this.width[i - 1] + x * 2) * 4 + c
                            ] +
                            this.colorsData[i - 1][
                                (y * 2 * this.width[i - 1] + x * 2 + 1) * 4 + c
                            ] +
                            this.colorsData[i - 1][
                                ((y * 2 + 1) * this.width[i - 1] + x * 2) * 4 +
                                    c
                            ] +
                            this.colorsData[i - 1][
                                ((y * 2 + 1) * this.width[i - 1] + x * 2 + 1) *
                                    4 +
                                    c
                            ];
                        this.colorsData[i][pos] = Math.round(value / 4);
                    }
                }
            }
        }
    }
}
