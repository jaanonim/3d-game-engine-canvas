import GameObject from "./GameObject";
import Renderer from "./Renderer";

export default class Component {
    gameObject!: GameObject;

    constructor() {}

    register(obj: GameObject) {
        this.gameObject = obj;
    }

    update() {}
    lateUpdate() {}
    render(_renderer: Renderer) {}
}
