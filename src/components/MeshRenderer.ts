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

    async onDestroy() {
        this.transform.onSomeGlobalUpdates.removeEventListener(
            this.updateTransform.bind(this)
        );
    }

    render(renderer: Renderer, camera: Camera) {
        renderer.renderMesh(this.transformedMesh, this.material, camera);
    }

    /**
     * Check if bounding box of mesh is outside camera clipping zone
     * @param camera
     * @returns boolean
     */
    isOnCamera(camera: Camera): boolean {
        const transformedMesh = this.transformedMesh.transformToCamera(camera);
        const res = camera.preClipObject(transformedMesh.boundingSphere);
        return res !== -1;
    }
}
