import Component from "../classes/Component";
import Renderer from "../classes/Renderer";
import Material from "../classes/Materials/Material";
import Mesh from "../utilities/Mesh";
import Texture from "../utilities/Texture";
import BasicMaterial from "../classes/Materials/BasicMaterial";
import Color from "../utilities/math/Color";
import DefaultMeshes from "../tools/DefaultMeshes";
import Camera from "./Camera";

export default class SpriteRenderer extends Component {
    mesh: Mesh | null;
    material: Material;

    constructor(texture: Texture, color: Color) {
        super();
        this.mesh = null;
        this.material = new BasicMaterial(color, texture, true);
    }

    async start(): Promise<void> {
        this.mesh = (await DefaultMeshes.plane).copy();
    }

    render(renderer: Renderer, camera: Camera) {
        if (this.mesh)
            renderer.renderMesh(
                this.mesh,
                this.material,
                this.gameObject.transform,
                camera
            );
    }
}
