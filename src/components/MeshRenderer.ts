import Component from "../classes/Component";
import Renderer from "../classes/Renderer";
import Material from "../classes/Materials/Material";
import Mesh from "../utilities/Mesh";

export default class MeshRenderer extends Component {
    mesh: Mesh;
    material: Material;

    constructor(mesh: Mesh, material: Material) {
        super();
        this.mesh = mesh;
        this.material = material;
    }

    render(renderer: Renderer) {
        renderer.renderMesh(
            this.mesh,
            this.material,
            this.gameObject.transform
        );
    }
}
