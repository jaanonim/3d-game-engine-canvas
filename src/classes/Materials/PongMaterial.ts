import Color from "../../utilities/math/Color";
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
                [triangle.vertices[0].z, triangle.verticesNormals[0]],
                [triangle.vertices[1].z, triangle.verticesNormals[1]],
                [triangle.vertices[2].z, triangle.verticesNormals[2]],
            ],
            (x, y, v) => {
                const z = v[0] as number;
                const normal = v[1] as Vector3;
                renderer.drawer.setPixelUsingDepthMap(x, y, z, () => {
                    if (!renderer.scene) throw Error("No scene!");
                    if (!renderer.camera) throw Error("No camera!");
                    const pos = renderer.camera.getOriginalCoords(
                        new Vector3(x, y, z),
                        renderer
                    );
                    const [c, i] = renderer.scene.illumination.computeLighting(
                        pos,
                        normal,
                        this.specular
                    );
                    return this.color.multiply(c.normalize().multiply(i));
                });
            }
        );
    }
}
