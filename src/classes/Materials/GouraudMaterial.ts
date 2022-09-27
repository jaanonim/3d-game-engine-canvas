import Renderer from "../Renderer";
import Triangle from "../../utilities/Triangle";
import Color from "../../utilities/math/Color";
import TextureMaterial from "./TextureMaterial";
import Texture from "../../utilities/Texture";
import Vector3 from "../../utilities/math/Vector3";

export default class GouraudMaterial extends TextureMaterial {
    specular: number;

    constructor(color: Color, specular: number, texture?: Texture) {
        super(color, texture);
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

        renderer.drawer.basicTriangle(
            [
                triangle.vertices[0].x,
                triangle.vertices[1].x,
                triangle.vertices[2].x,
            ],
            [
                triangle.vertices[0].y,
                triangle.vertices[1].y,
                triangle.vertices[2].y,
            ],
            [
                [
                    triangle.vertices[0].z,
                    this.color.copy().multiply(c1.normalize().multiply(i1)),
                    triangle.verticesUvs[0].multiply(triangle.vertices[0].z),
                ],
                [
                    triangle.vertices[1].z,
                    this.color.copy().multiply(c2.normalize().multiply(i2)),
                    triangle.verticesUvs[1].multiply(triangle.vertices[1].z),
                ],
                [
                    triangle.vertices[2].z,
                    this.color.copy().multiply(c3.normalize().multiply(i3)),
                    triangle.verticesUvs[2].multiply(triangle.vertices[2].z),
                ],
            ],
            (x, y, v) => {
                const z = v[0] as number;
                const c = v[1] as Color;
                const uv = v[2] as Vector3;

                renderer.drawer.setPixelUsingDepthMap(x, y, z, () =>
                    this.texture
                        ? this.texture
                              .get(uv.x / z, uv.y / z)
                              .multiply(c.normalize())
                        : c
                );
            }
        );
    }
}
