import Vector3 from "../utilities/Vector3";
import GameObject from "./GameObject";
import Illumination from "./Illumination";
import Renderer from "./Renderer";

export default class Scene {
    name: string;
    children: Array<GameObject>;
    illumination: Illumination;

    constructor(name: string) {
        this.name = name;
        this.children = [];
        this.illumination = new Illumination();
    }

    getWordPosition() {
        return Vector3.zero;
    }

    addChildren(obj: GameObject) {
        this.children.push(obj);
        obj.transform.setParent(this);
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

    find(name: string) {
        return this.children.filter((c) => c.name == name);
    }
}
