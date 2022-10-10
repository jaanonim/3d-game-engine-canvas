import Color from "../utilities/math/Color";
import { map } from "../utilities/math/Math";
import {
    getInterpolatedNumber,
    getInterpolatedValue,
    interpolateNumber,
    interpolateValue,
    Iterpolatable,
} from "../utilities/math/Interpolation";
import Vector3 from "../utilities/math/Vector3";
import VirtualCanvas from "../utilities/VirtualCanvas";

type ColorFn = () => Color;

type TriangleCallback = (
    x: number,
    y: number,
    values: Array<Iterpolatable>,
    sequence: Array<Array<Iterpolatable>>,
    i: number
) => void;

export default class Drawer {
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    img: ImageData;
    depthBuffer: Float32Array;

    constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.img = this.ctx.createImageData(width, height);
        this.depthBuffer = new Float32Array(this.width * this.height);
    }

    resize(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    drawLine(p0: Vector3, p1: Vector3, color: Color, isTransparent: boolean) {
        if (Math.abs(p1.x - p0.x) > Math.abs(p1.y - p0.y)) {
            if (p0.x > p1.x) {
                const ys = interpolateNumber(p1.x, p1.y, p0.x, p0.y);
                const zs = interpolateNumber(p1.x, p1.z, p0.x, p0.z);
                let i = 0;
                for (let x = p1.x; x <= p0.x; x++) {
                    const _x = Math.ceil(x);
                    const _y = Math.ceil(ys[i]);
                    this.setPixelUsingDepthMap(
                        _x,
                        _y,
                        zs[i],
                        isTransparent,
                        color
                    );
                    i++;
                }
            } else {
                const ys = interpolateNumber(p0.x, p0.y, p1.x, p1.y);
                const zs = interpolateNumber(p0.x, p0.z, p1.x, p1.z);
                let i = 0;
                for (let x = p0.x; x <= p1.x; x++) {
                    const _x = Math.ceil(x);
                    const _y = Math.ceil(ys[i]);
                    this.setPixelUsingDepthMap(
                        _x,
                        _y,
                        zs[i],
                        isTransparent,
                        color
                    );
                    i++;
                }
            }
        } else {
            if (p0.y > p1.y) {
                const xs = interpolateNumber(p1.y, p1.x, p0.y, p0.x);
                const zs = interpolateNumber(p1.y, p1.z, p0.y, p0.z);
                let i = 0;
                for (let y = p1.y; y <= p0.y; y++) {
                    const _x = Math.ceil(xs[i]);
                    const _y = Math.ceil(y);
                    this.setPixelUsingDepthMap(
                        _x,
                        _y,
                        zs[i],
                        isTransparent,
                        color
                    );

                    i++;
                }
            } else {
                const xs = interpolateNumber(p0.y, p0.x, p1.y, p1.x);
                const zs = interpolateNumber(p0.y, p0.z, p1.y, p1.z);
                let i = 0;
                for (let y = p0.y; y <= p1.y; y++) {
                    const _x = Math.ceil(xs[i]);
                    const _y = Math.ceil(y);
                    this.setPixelUsingDepthMap(
                        _x,
                        _y,
                        zs[i],
                        isTransparent,
                        color
                    );
                    i++;
                }
            }
        }
    }

    basicTriangle(
        xList: [number, number, number],
        yList: [number, number, number],
        values: [
            Array<Iterpolatable>,
            Array<Iterpolatable>,
            Array<Iterpolatable>
        ],
        callback: TriangleCallback
    ) {
        const v = yList.map((y, i): [number, number, Array<Iterpolatable>] => [
            y,
            xList[i],
            values[i],
        ]);
        v.sort((a, b) => a[0] - b[0]);
        const [[y0, x0, values0], [y1, x1, values1], [y2, x2, values2]] = v;

        const [x012, x02] = getInterpolatedNumber(x0, x1, x2, y0, y1, y2);
        const m = Math.floor(x012.length / 2);
        let reverse = x02[m] < x012[m];
        let xs = [];
        if (reverse) {
            xs = [x02, x012];
        } else {
            xs = [x012, x02];
        }

        const res: Array<[Array<Iterpolatable>, Array<Iterpolatable>]> = [];
        values0.forEach((_v, i) => {
            const [res012, res02] = getInterpolatedValue(
                values0[i],
                values1[i],
                values2[i],
                y0,
                y1,
                y2
            );
            if (reverse) res.push([res02, res012]);
            else res.push([res012, res02]);
        });

        let i = 0;
        for (let y = y0; y <= y2; y++) {
            const xl = xs[0][i];
            const xr = xs[1][i];

            const segments = res.map((ele) =>
                interpolateValue(ele[0][i], ele[1][i], xl, xr)
            );

            let j = 0;
            for (let x = xl; x < xr; x++) {
                const _x = Math.ceil(x);
                const _y = Math.ceil(y);

                callback(
                    _x,
                    _y,
                    segments.map((ele) => ele[j]),
                    segments,
                    j
                );
                j++;
            }
            i++;
        }
    }

    setPixelUsingDepthMap(
        x: number,
        y: number,
        z: number,
        isTransparent: boolean,
        color: Color | ColorFn
    ) {
        if (isTransparent) {
            if (color instanceof Color) this.setPixel(x, y, color);
            else this.setPixel(x, y, color());
        } else if (z > this.depthBuffer[y * this.width + x]) {
            if (color instanceof Color) this.setPixel(x, y, color);
            else this.setPixel(x, y, color());
            this.depthBuffer[y * this.width + x] = z;
        }
    }

    setPixel(x: number, y: number, color: Color) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
        const c = this.getPixel(x, y).blend(color);

        this.img.data[y * (this.width * 4) + x * 4] = c.r;
        this.img.data[y * (this.width * 4) + x * 4 + 1] = c.g;
        this.img.data[y * (this.width * 4) + x * 4 + 2] = c.b;
        this.img.data[y * (this.width * 4) + x * 4 + 3] = c.a;
    }

    getPixel(x: number, y: number): Color {
        return new Color(
            this.img.data[y * (this.width * 4) + x * 4],
            this.img.data[y * (this.width * 4) + x * 4 + 1],
            this.img.data[y * (this.width * 4) + x * 4 + 2],
            this.img.data[y * (this.width * 4) + x * 4 + 3]
        );
    }

    begin() {
        this.img = this.ctx.createImageData(this.width, this.height);
        for (let i = 0; i < this.width * this.height; i++) {
            this.depthBuffer[i] = 0;
        }
    }

    end() {
        const DRAW_DEPTH_BUFFER = false;
        if (DRAW_DEPTH_BUFFER) {
            let max = 0;
            for (let i = 0; i < this.width * this.height; i++) {
                max = Math.max(this.depthBuffer[i], max);
            }

            for (let x = 0; x < this.width; x++) {
                for (let y = 0; y < this.height; y++) {
                    const c = map(
                        this.depthBuffer[y * this.width + x],
                        0,
                        max,
                        0,
                        255
                    );
                    this.setPixel(x, y, new Color(c, c, c, 255));
                }
            }
        }

        this.ctx.putImageData(this.img, 0, 0);
    }

    drawVirtualCanvas(canvas: VirtualCanvas) {
        const vc = new VirtualCanvas(this.width, this.height);
        vc.ctx.putImageData(this.img, 0, 0);
        vc.ctx.drawImage(canvas.canvas, 0, 0);
        this.img = vc.ctx.getImageData(0, 0, this.width, this.height);
    }
}
