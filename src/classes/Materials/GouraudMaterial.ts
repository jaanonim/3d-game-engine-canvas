import Renderer from "../Renderer";
import Material from "./Material";
import Triangle from "../../utilities/Triangle";
import Color from "../../utilities/math/Color";

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
                    this.color.multiply(c1.normalize().multiply(i1)),
                ],
                [
                    triangle.vertices[1].z,
                    this.color.multiply(c2.normalize().multiply(i2)),
                ],
                [
                    triangle.vertices[2].z,
                    this.color.multiply(c3.normalize().multiply(i3)),
                ],
            ],
            (x, y, v) => {
                renderer.drawer.setPixelUsingDepthMap(
                    x,
                    y,
                    v[0] as number,
                    v[1] as Color
                );
            }
        );
    }
}
