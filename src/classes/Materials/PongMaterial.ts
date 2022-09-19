import Color from "../../utilities/math/Color";
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
        if (!renderer.scene) throw Error("No scene!");
        if (!renderer.camera) throw Error("No camera!");

        renderer.drawer.drawTriangleFiledPong(
            triangle.vertices[0],
            triangle.vertices[1],
            triangle.vertices[2],
            this.color,
            renderer.camera,
            renderer.scene.illumination,
            triangle.normal,
            this.specular,
            renderer
        );
    }
}
