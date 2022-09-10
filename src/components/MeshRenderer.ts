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

    getBoundingSphere() {
        return {
            center: this.mesh.boundingSphere.center,
            radius:
                this.mesh.boundingSphere.radius *
                Math.max(
                    this.gameObject.transform.globalScale.x,
                    this.gameObject.transform.globalScale.y,
                    this.gameObject.transform.globalScale.z
                ),
        };
    }
}
