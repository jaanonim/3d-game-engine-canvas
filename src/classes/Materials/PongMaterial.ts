import Color from "../../utilities/math/Color";
import {
    getInterpolatedValues,
    getInterpolatedVector3,
    interpolate,
    interpolateVector3,
} from "../../utilities/math/Math";
import Vector3 from "../../utilities/math/Vector3";
import Triangle from "../../utilities/Triangle";
import Renderer from "../Renderer";
import Material from "./Material";

export default class PongMaterial extends Material {
    specular: number;

    constructor(color: Color, specular: number) {
        super(color);
        this.specular = specular;
    }

    renderTriangle(
        triangle: Triangle,
        _originalTriangle: Triangle,
        renderer: Renderer
    ) {
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
                const _z = z_segment[j];
                const _x = Math.ceil(x);
                const _y = Math.ceil(y);
                renderer.drawer.setPixelUsingDepthMap(_x, _y, _z, () => {
                    if (!renderer.scene) throw Error("No scene!");
                    if (!renderer.camera) throw Error("No camera!");
                    const pos = renderer.camera.getOriginalCoords(
                        new Vector3(_x, _y, _z),
                        renderer
                    );
                    const [c, i] = renderer.scene.illumination.computeLighting(
                        pos,
                        n_segment[j],
                        this.specular
                    );
                    return this.color.multiply(c.normalize().multiply(i));
                });
                j++;
            }
            i++;
        }
    }
}
