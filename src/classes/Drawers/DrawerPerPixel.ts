import Drawer from ".";
import Color from "../../utilities/Color";
import { interpolate, map } from "../../utilities/Math";
import Vector2 from "../../utilities/Vector2";
import Vector3 from "../../utilities/Vector3";

export default class DrawerPerPixel extends Drawer {
    img: ImageData;
    depthBuffer: Float32Array;

    constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
        super(ctx, width, height);
        this.img = this.ctx.createImageData(width, height);
        this.depthBuffer = new Float32Array(this.width * this.height);
    }

    resize(width: number, height: number): void {
        super.resize(width, height);
    }

    drawTriangleFilled(_p1: Vector3, _p2: Vector3, _p3: Vector3, color: Color) {
        const c = (1 / _p3.z) * 500;
        color = new Color(c, c, c, 255);
        const a = [_p1, _p2, _p3];
        a.sort((a, b) => a.y - b.y);
        const [p1, p2, p3] = a;

        const x12 = interpolate(p1.y, p1.x, p2.y, p2.x);
        const x23 = interpolate(p2.y, p2.x, p3.y, p3.x);
        const x13 = interpolate(p1.y, p1.x, p3.y, p3.x);

        x12.pop();
        const x123 = [...x12];
        x123.push(...x23);

        const z12 = interpolate(p1.y, p1.z, p2.y, p2.z);
        const z23 = interpolate(p2.y, p2.z, p3.y, p3.z);
        const z13 = interpolate(p1.y, p1.z, p3.y, p3.z);

        z12.pop();
        const z123 = [...z12];
        z123.push(...z23);

        const m = Math.floor(x123.length / 2);
        let x_left, x_right;
        let z_left, z_right;

        if (x13[m] < x123[m]) {
            x_left = x13;
            x_right = x123;

            z_left = z13;
            z_right = z123;
        } else {
            x_left = x123;
            x_right = x13;

            z_left = z123;
            z_right = z13;
        }

        let i = 0;
        for (let y = p1.y; y <= p3.y; y++) {
            const xl = x_left[i];
            const xr = x_right[i];
            const z_segment = interpolate(xl, z_left[i], xr, z_right[i]);
            let j = 0;
            for (let x = xl; x < xr; x++) {
                const z = 1 / z_segment[j];
                const _x = Math.ceil(x);
                const _y = Math.ceil(y);

                if (z > this.depthBuffer[_y * this.width + _x]) {
                    this.setPixel(_x, _y, color);
                    this.depthBuffer[_y * this.width + _x] = z;
                }
                j++;
            }
            i++;
        }
    }

    drawTriangleWireframe(p1: Vector2, p2: Vector2, p3: Vector2, color: Color) {
        this.drawLine(p1, p2, color);
        this.drawLine(p2, p3, color);
        this.drawLine(p3, p1, color);
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
