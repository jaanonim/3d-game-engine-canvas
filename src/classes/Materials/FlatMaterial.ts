import Color from "../../utilities/math/Color";
import Triangle from "../../utilities/Triangle";
import Renderer from "../Renderer";
import Material from "./Material";

export default class FlatMaterial extends Material {
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
        const [c, i] = renderer.scene.illumination.computeLighting(
            originalTriangle.center(),
            originalTriangle.normal,
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
                [triangle.vertices[0].z],
                [triangle.vertices[1].z],
                [triangle.vertices[2].z],
            ],
            (x, y, v) => {
                renderer.drawer.setPixelUsingDepthMap(
                    x,
                    y,
                    v[0] as number,
                    this.color.multiply(c.normalize().multiply(i))
                );
            }
        );
    }
}
