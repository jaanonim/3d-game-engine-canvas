import Color from "../utilities/math/Color";
import { interpolate, map } from "../utilities/math/Math";
import Vector2 from "../utilities/math/Vector2";

type ColorFn = () => Color;

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

    drawLine(p0: Vector2, p1: Vector2, color: Color) {
        if (Math.abs(p1.x - p0.x) > Math.abs(p1.y - p0.y)) {
            if (p0.x > p1.x) {
                const ys = interpolate(p1.x, p1.y, p0.x, p0.y);
                let i = 0;
                for (let x = p1.x; x <= p0.x; x++) {
                    const _x = Math.ceil(x);
                    const _y = Math.ceil(ys[i]);
                    this.setPixel(_x, _y, color);
                    i++;
                }
            } else {
                const ys = interpolate(p0.x, p0.y, p1.x, p1.y);
                let i = 0;
                for (let x = p0.x; x <= p1.x; x++) {
                    const _x = Math.ceil(x);
                    const _y = Math.ceil(ys[i]);
                    this.setPixel(_x, _y, color);
                    i++;
                }
            }
        } else {
            if (p0.y > p1.y) {
                const xs = interpolate(p1.y, p1.x, p0.y, p0.x);
                let i = 0;
                for (let y = p1.y; y <= p0.y; y++) {
                    const _x = Math.ceil(xs[i]);
                    const _y = Math.ceil(y);
                    this.setPixel(_x, _y, color);
                    i++;
                }
            } else {
                const xs = interpolate(p0.y, p0.x, p1.y, p1.x);
                let i = 0;
                for (let y = p0.y; y <= p1.y; y++) {
                    const _x = Math.ceil(xs[i]);
                    const _y = Math.ceil(y);
                    this.setPixel(_x, _y, color);
                    i++;
                }
            }
        }
    }

    setPixelUsingDepthMap(
        x: number,
        y: number,
        z: number,
        color: Color | ColorFn
    ) {
        if (z > this.depthBuffer[y * this.width + x]) {
            if (color instanceof Color) this.setPixel(x, y, color);
            else this.setPixel(x, y, color());
            this.depthBuffer[y * this.width + x] = z;
        }
    }

    setPixel(x: number, y: number, color: Color) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;

        this.img.data[y * (this.width * 4) + x * 4] = color.r;
        this.img.data[y * (this.width * 4) + x * 4 + 1] = color.g;
        this.img.data[y * (this.width * 4) + x * 4 + 2] = color.b;
        this.img.data[y * (this.width * 4) + x * 4 + 3] = color.a;
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
}
