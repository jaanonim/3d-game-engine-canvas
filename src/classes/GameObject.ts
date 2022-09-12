import Transform from "../utilities/Transform";
import Component from "./Component";
import Renderer from "./Renderer";

export default class GameObject {
    name: string;
    transform: Transform;
    children: Array<GameObject>;
    components: Array<Component>;

    private static _register: { [name: string]: GameObject } = {};

    static get(name: string) {
        return this._register[name];
    }

    constructor(name: string) {
        this.name = name;
        this.transform = new Transform();
        this.children = [];
        this.components = [];
        GameObject._register[name] = this;
    }

    addChildren(obj: GameObject) {
        this.children.push(obj);
        this.transform.addChildren(obj.transform);
        return obj;
    }

    addComponent(obj: Component) {
        this.components.push(obj);
        obj.register(this);
        return obj;
    }

    update() {
        this.children.forEach((c) => c.update());
        this.components.forEach((c) => c.update());
    }

    lateUpdate() {
        this.children.forEach((c) => c.lateUpdate());
        this.components.forEach((c) => c.lateUpdate());
    }

    render(renderer: Renderer) {
        this.children.forEach((c) => c.render(renderer));
        this.components.forEach((c) => c.render(renderer));
    }
}
