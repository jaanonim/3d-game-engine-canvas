import Component from "../classes/Component";
import Renderer from "../classes/Renderer";
import Mesh from "../utilities/Mesh";

export default class MeshRenderer extends Component {
    mesh: Mesh;

    constructor(mesh: Mesh) {
        super();
        this.mesh = mesh;
    }

    render(renderer: Renderer) {
        renderer.renderMesh(this.mesh, this.gameObject.transform);
    }
}
