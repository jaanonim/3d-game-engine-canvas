import Vector3 from "../utilities/Vector3";
import GameObject from "./GameObject";
import Renderer from "./Renderer";

export default class Scene {
    name: string;
    children: Array<GameObject>;

    constructor(name: string) {
        this.name = name;
        this.children = [];
    }

    getWordPosition() {
        return Vector3.zero;
    }

    addChildren(obj: GameObject) {
        this.children.push(obj);
        return obj;
    }

    render(renderer: Renderer) {
        this.children.forEach((c) => c.render(renderer));
    }

    update() {
        this.children.forEach((c) => c.update());
    }

    lateUpdate() {
        this.children.forEach((c) => c.lateUpdate());
    }
}
