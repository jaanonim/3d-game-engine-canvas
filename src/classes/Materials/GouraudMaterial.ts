import Renderer from "../Renderer";
import Material from "./Material";
import Triangle from "../../utilities/Triangle";
import Color from "../../utilities/math/Color";
import Vector3 from "../../utilities/math/Vector3";
import {
    getInterpolatedColor,
    getInterpolatedValues,
    interpolate,
    interpolateColor,
} from "../../utilities/math/Math";

export default class GouraudMaterial extends Material {
    specular: number;

    constructor(color: Color, specular: number) {
        super(color);
        this.specular = specular;
    }

    renderTriangle(
        triangle: Triangle,
        originalTriangle: Triangle,
        renderer: Renderer
    ) {
        if (!renderer.scene) throw Error("No scene!");
        if (!renderer.camera) throw Error("No camera!");

        const [c1, i1] = renderer.scene.illumination.computeLighting(
            originalTriangle.vertices[0],
            originalTriangle.verticesNormals[0],
            this.specular
        );

        const [c2, i2] = renderer.scene.illumination.computeLighting(
            originalTriangle.vertices[1],
            originalTriangle.verticesNormals[1],
            this.specular
        );

        const [c3, i3] = renderer.scene.illumination.computeLighting(
            originalTriangle.vertices[2],
            originalTriangle.verticesNormals[2],
            this.specular
        );

        this.drawTriangleFilledShaded(
            triangle,
            this.color.multiply(c1.normalize().multiply(i1)),
            this.color.multiply(c2.normalize().multiply(i2)),
            this.color.multiply(c3.normalize().multiply(i3)),
            renderer
        );
    }

    drawTriangleFilledShaded(
        triangle: Triangle,
        _color1: Color,
        _color2: Color,
        _color3: Color,
        renderer: Renderer
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
                const _z = z_segment[j];
                const _x = Math.ceil(x);
                const _y = Math.ceil(y);

                renderer.drawer.setPixelUsingDepthMap(_x, _y, _z, c_segment[j]);
                j++;
            }
            i++;
        }
    }
}
