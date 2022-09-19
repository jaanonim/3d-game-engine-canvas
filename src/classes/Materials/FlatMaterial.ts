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
            renderer.camera,
            originalTriangle.center(),
            originalTriangle.normal,
            this.specular
        );

        renderer.drawer.drawTriangleFilled(
            triangle.vertices[0],
            triangle.vertices[1],
            triangle.vertices[2],
            this.color.multiply(c.normalize().multiply(i))
        );
    }
}
