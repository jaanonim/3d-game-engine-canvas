import Color from "../../utilities/math/Color";
import {
    getInterpolatedColor,
    getInterpolatedValues,
    getInterpolatedVector3,
    interpolate,
    interpolateColor,
    interpolateVector3,
} from "../../utilities/math/Math";
import Vector3 from "../../utilities/math/Vector3";
import Triangle from "../../utilities/Triangle";
import Renderer from "../Renderer";
import DrawerLib from "./DrawerLib";

export default class Drawer extends DrawerLib {
    drawTriangleWireframe(triangle: Triangle, color: Color) {
        this.drawLine(triangle.vertices[0], triangle.vertices[1], color);
        this.drawLine(triangle.vertices[1], triangle.vertices[2], color);
        this.drawLine(triangle.vertices[2], triangle.vertices[0], color);
    }

    drawTriangleFilled(triangle: Triangle, color: Color) {
        const a = [
            triangle.vertices[0],
            triangle.vertices[1],
            triangle.vertices[2],
        ];
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
        triangle: Triangle,
        _color1: Color,
        _color2: Color,
        _color3: Color
    ) {
        const a: Array<[Vector3, Color]> = [
            [triangle.vertices[0], _color1],
            [triangle.vertices[1], _color2],
            [triangle.vertices[2], _color3],
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

        const [c123, c13] = getInterpolatedColor(
            color1,
            color2,
            color3,
            p1.y,
            p2.y,
            p3.y
        );

        const m = Math.floor(x123.length / 2);
        let x_left, x_right;
        let z_left, z_right;
        let c_left, c_right;

        if (x13[m] < x123[m]) {
            x_left = x13;
            x_right = x123;

            z_left = z13;
            z_right = z123;

            c_left = c13;
            c_right = c123;
        } else {
            x_left = x123;
            x_right = x13;

            z_left = z123;
            z_right = z13;

            c_left = c123;
            c_right = c13;
        }

        let i = 0;
        for (let y = p1.y; y <= p3.y; y++) {
            const xl = x_left[i];
            const xr = x_right[i];
            const z_segment = interpolate(xl, z_left[i], xr, z_right[i]);
            const c_segment = interpolateColor(c_left[i], c_right[i], xl, xr);

            let j = 0;
            for (let x = xl; x < xr; x++) {
                const z = z_segment[j];
                const _x = Math.ceil(x);
                const _y = Math.ceil(y);

                if (z > this.depthBuffer[_y * this.width + _x]) {
                    this.setPixel(_x, _y, c_segment[j]);
                    this.depthBuffer[_y * this.width + _x] = z;
                }
                j++;
            }
            i++;
        }
    }

    drawTriangleFiledPong(
        triangle: Triangle,
        color: Color,
        specular: number,
        renderer: Renderer
    ) {
        if (!renderer.scene) throw Error("No scene!");
        if (!renderer.camera) throw Error("No camera!");

        const a = [
            [triangle.vertices[0], triangle.verticesNormals[0]],
            [triangle.vertices[1], triangle.verticesNormals[1]],
            [triangle.vertices[2], triangle.verticesNormals[2]],
        ];
        a.sort((a, b) => a[0].y - b[0].y);
        const [[p1, n1], [p2, n2], [p3, n3]] = a;

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

        const [n123, n13] = getInterpolatedVector3(
            n1,
            n2,
            n3,
            p1.y,
            p2.y,
            p3.y
        );

        const m = Math.floor(x123.length / 2);
        let x_left, x_right;
        let z_left, z_right;
        let n_left, n_right;

        if (x13[m] < x123[m]) {
            x_left = x13;
            x_right = x123;

            z_left = z13;
            z_right = z123;

            n_left = n13;
            n_right = n123;
        } else {
            x_left = x123;
            x_right = x13;

            z_left = z123;
            z_right = z13;

            n_left = n123;
            n_right = n13;
        }

        let i = 0;
        for (let y = p1.y; y <= p3.y; y++) {
            const xl = x_left[i];
            const xr = x_right[i];
            const z_segment = interpolate(xl, z_left[i], xr, z_right[i]);
            const n_segment = interpolateVector3(n_left[i], n_right[i], xl, xr);
            let j = 0;
            for (let x = xl; x < xr; x++) {
                const z = z_segment[j];
                const _x = Math.ceil(x);
                const _y = Math.ceil(y);

                if (z > this.depthBuffer[_y * this.width + _x]) {
                    const pos = renderer.camera.getOriginalCoords(
                        new Vector3(_x, _y, z),
                        renderer
                    );
                    const [c, i] = renderer.scene.illumination.computeLighting(
                        pos,
                        n_segment[j],
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
}
