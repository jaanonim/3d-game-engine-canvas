import Drawer from ".";
import Color from "../../utilities/Color";
import { interpolate } from "../../utilities/Math";
import Vector2 from "../../utilities/Vector2";

export default class DrawerPerPixel extends Drawer {
    img: ImageData;

    constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
        super(ctx, width, height);
        this.img = this.ctx.createImageData(width, height);
    }

    resize(width: number, height: number): void {
        super.resize(width, height);
        this.img = this.ctx.createImageData(this.width, this.height);
    }

    drawTriangleFilled(_p1: Vector2, _p2: Vector2, _p3: Vector2, color: Color) {
        const a = [_p1, _p2, _p3];
        a.sort((a, b) => a.y - b.y);
        const [p1, p2, p3] = a;

        const x12 = interpolate(p1.y, p1.x, p2.y, p2.x);
        const x23 = interpolate(p2.y, p2.x, p3.y, p3.x);
        const x13 = interpolate(p1.y, p1.x, p3.y, p3.x);

        x12.pop();
        const x123 = [...x12];
        x123.push(...x23);

        const m = Math.floor(x123.length / 2);
        let x_left, x_right;
        if (x13[m] < x123[m]) {
            x_left = x13;
            x_right = x123;
        } else {
            x_left = x123;
            x_right = x13;
        }

        let i = 0;
        for (let y = p1.y; y <= p3.y; y++) {
            for (let x = x_left[i]; x < x_right[i]; x++) {
                this.setPixel(x, y, color);
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
                    this.setPixel(x, ys[i], color);
                    i++;
                }
            } else {
                const ys = interpolate(p0.x, p0.y, p1.x, p1.y);
                let i = 0;
                for (let x = p0.x; x <= p1.x; x++) {
                    this.setPixel(x, ys[i], color);
                    i++;
                }
            }
        } else {
            if (p0.y > p1.y) {
                const xs = interpolate(p1.y, p1.x, p0.y, p0.x);
                let i = 0;
                for (let y = p1.y; y <= p0.y; y++) {
                    this.setPixel(xs[i], y, color);
                    i++;
                }
            } else {
                const xs = interpolate(p0.y, p0.x, p1.y, p1.x);
                let i = 0;
                for (let y = p0.y; y <= p1.y; y++) {
                    this.setPixel(xs[i], y, color);
                    i++;
                }
            }
        }
    }

    setPixel(x: number, y: number, color: Color) {
        x = Math.round(x);
        y = Math.round(y);
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;

        this.img.data[y * (this.width * 4) + x * 4] = color.r;
        this.img.data[y * (this.width * 4) + x * 4 + 1] = color.g;
        this.img.data[y * (this.width * 4) + x * 4 + 2] = color.b;
        this.img.data[y * (this.width * 4) + x * 4 + 3] = color.a;
    }

    begin() {
        this.img = this.ctx.createImageData(this.width, this.height);
    }

    end() {
        this.ctx.putImageData(this.img, 0, 0);
    }
}
