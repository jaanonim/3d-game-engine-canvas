import Component from "../classes/Components/Component";
import Renderer from "../classes/Renderer";
import Vector3 from "../utilities/math/Vector3";
import Quaternion from "../utilities/math/Quaternion";

export default class Rotate extends Component {
    v: number;
    rotation: Vector3;

    constructor(rotation: Vector3) {
        super();
        this.v = 0;
        this.rotation = rotation;
    }

    async update() {
        this.gameObject.transform.rotation = Quaternion.euler(
            this.rotation.multiply(this.v)
        );
        this.v += Renderer.deltaTime;
    }
}
