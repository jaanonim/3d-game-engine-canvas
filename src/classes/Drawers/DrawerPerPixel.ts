import Drawer from ".";
import Camera from "../../components/Camera";
import Color from "../../utilities/math/Color";
import {
    getInterpolatedValues,
    interpolate,
    map,
} from "../../utilities/math/Math";
import Vector2 from "../../utilities/math/Vector2";
import Vector3 from "../../utilities/math/Vector3";
import Illumination from "../Illumination";
import Renderer from "../Renderer";

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
        const a = [_p1, _p2, _p3];
        a.sort((a, b) => a.y - b.y);
        const [p1, p2, p3] = a;

        const [x123, x13] = getInterpolatedValues(
            p1.x,
            p2.x,
            p3.x,
            p1.y,
            p2.y,
            p3.y
        );

        const [z123, z13] = getInterpolatedValues(
            p1.z,
            p2.z,
            p3.z,
            p1.y,
            p2.y,
            p3.y
        );

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
                const z = z_segment[j];
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

    drawTriangleFilledShaded(
        _p1: Vector3,
        _p2: Vector3,
        _p3: Vector3,
        _color1: Color,
        _color2: Color,
        _color3: Color
    ) {
        const a: Array<[Vector3, Color]> = [
            [_p1, _color1],
            [_p2, _color2],
            [_p3, _color3],
        ];
        a.sort((a, b) => a[0].y - b[0].y);
        const [[p1, color1], [p2, color2], [p3, color3]] = a;

        const [x123, x13] = getInterpolatedValues(
            p1.x,
            p2.x,
            p3.x,
            p1.y,
            p2.y,
            p3.y
        );

        const [z123, z13] = getInterpolatedValues(
            p1.z,
            p2.z,
            p3.z,
            p1.y,
            p2.y,
            p3.y
        );

        const [r123, r13] = getInterpolatedValues(
            color1.r,
            color2.r,
            color3.r,
            p1.y,
            p2.y,
            p3.y
        );

        const [g123, g13] = getInterpolatedValues(
            color1.g,
            color2.g,
            color3.g,
            p1.y,
            p2.y,
            p3.y
        );

        const [b123, b13] = getInterpolatedValues(
            color1.b,
            color2.b,
            color3.b,
            p1.y,
            p2.y,
            p3.y
        );

        const [a123, a13] = getInterpolatedValues(
            color1.a,
            color2.a,
            color3.a,
            p1.y,
            p2.y,
            p3.y
        );

        const m = Math.floor(x123.length / 2);
        let x_left, x_right;
        let z_left, z_right;
        let r_left, r_right;
        let g_left, g_right;
        let b_left, b_right;
        let a_left, a_right;

        if (x13[m] < x123[m]) {
            x_left = x13;
            x_right = x123;

            z_left = z13;
            z_right = z123;

            r_left = r13;
            r_right = r123;

            g_left = g13;
            g_right = g123;

            b_left = b13;
            b_right = b123;

            a_left = a13;
            a_right = a123;
        } else {
            x_left = x123;
            x_right = x13;

            z_left = z123;
            z_right = z13;

            r_left = r123;
            r_right = r13;

            g_left = g123;
            g_right = g13;

            b_left = b123;
            b_right = b13;

            a_left = a123;
            a_right = a13;
        }

        let i = 0;
        for (let y = p1.y; y <= p3.y; y++) {
            const xl = x_left[i];
            const xr = x_right[i];
            const z_segment = interpolate(xl, z_left[i], xr, z_right[i]);
            const r_segment = interpolate(xl, r_left[i], xr, r_right[i]);
            const g_segment = interpolate(xl, g_left[i], xr, g_right[i]);
            const b_segment = interpolate(xl, b_left[i], xr, b_right[i]);
            const a_segment = interpolate(xl, a_left[i], xr, a_right[i]);

            let j = 0;
            for (let x = xl; x < xr; x++) {
                const z = z_segment[j];
                const _x = Math.ceil(x);
                const _y = Math.ceil(y);

                if (z > this.depthBuffer[_y * this.width + _x]) {
                    this.setPixel(
                        _x,
                        _y,
                        new Color(
                            r_segment[j],
                            g_segment[j],
                            b_segment[j],
                            a_segment[j]
                        )
                    );
                    this.depthBuffer[_y * this.width + _x] = z;
                }
                j++;
            }
            i++;
        }
    }

    drawTriangleFiledPong(
        _p1: Vector3,
        _p2: Vector3,
        _p3: Vector3,
        color: Color,
        camera: Camera,
        illumination: Illumination,
        normal: Vector3,
        specular: number,
        renderer: Renderer
    ) {
        const a = [_p1, _p2, _p3];
        a.sort((a, b) => a.y - b.y);
        const [p1, p2, p3] = a;

        const [x123, x13] = getInterpolatedValues(
            p1.x,
            p2.x,
            p3.x,
            p1.y,
            p2.y,
            p3.y
        );

        const [z123, z13] = getInterpolatedValues(
            p1.z,
            p2.z,
            p3.z,
            p1.y,
            p2.y,
            p3.y
        );

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
                const z = z_segment[j];
                const _x = Math.ceil(x);
                const _y = Math.ceil(y);

                if (z > this.depthBuffer[_y * this.width + _x]) {
                    const pos = camera.getOriginalCoords(
                        new Vector3(_x, _y, z),
                        renderer,
                    );
                    const [c, i] = illumination.computeLighting(
                        camera,
                        pos,
                        normal,
                        specular
                    );
                    this.setPixel(
                        _x,
                        _y,
                        color.multiply(c.normalize().multiply(i))
                    );
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
