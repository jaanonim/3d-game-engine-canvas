import Renderer from "../../classes/Renderer";
import Camera from "../../components/Camera";
import Vector2 from "../../utilities/math/Vector2";
import Vector3 from "../../utilities/math/Vector3";
import Raycasts from "./Raycast";
import SimpleRaycast from "./SimpleRaycast";

export default class ScreenRaycast implements Raycasts {
    camera: Camera;
    renderer: Renderer;
    raycast: SimpleRaycast;

    constructor(camera: Camera, renderer: Renderer) {
        this.camera = camera;
        this.renderer = renderer;
        this.raycast = new SimpleRaycast(this.camera.gameObject.getScene());
    }

    /**
     * Casts ray from point on screen to world and for collisions with bounding spheres of meshes on scene
     * @param position position on canvas
     * @param length length of ray
     * @returns Array of RaycastResult
     */
    getCollisions(position: Vector2, length: number = Infinity) {
        const v = this.camera.screenPointToVector(
            this.renderer.scaleCanvasVector(position),
            this.renderer
        );
        return this.raycast.getCollisions(
            this.camera.transform.globalPosition,
            this.camera.transform.globalRotation.multiply(v),
            length
        );
    }
}
