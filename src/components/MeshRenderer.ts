import Component from "../classes/Components/Component";
import Renderer from "../classes/Renderer";
import Material from "../classes/Materials/Material";
import Mesh from "../utilities/Mesh";
import Camera from "./Camera";

export default class MeshRenderer extends Component {
    mesh: Mesh;
    transformedMesh: Mesh;
    material: Material;

    constructor(mesh: Mesh, material: Material) {
        super();
        this.mesh = mesh;
        this.transformedMesh = this.mesh;
        this.material = material;
    }

    async start() {
        this.transform.onSomeGlobalUpdates.addEventListener(
            this.updateTransform.bind(this)
        );
        this.updateTransform();
    }

    updateTransform() {
        this.transformedMesh = this.mesh.transformToWorld(this.transform);
    }

    render(renderer: Renderer, camera: Camera) {
        renderer.renderMesh(this.transformedMesh, this.material, camera);
    }
}
