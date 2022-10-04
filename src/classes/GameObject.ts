import Camera from "../components/Camera";
import Transform from "../utilities/Transform";
import Component from "./Component";
import Renderer from "./Renderer";
import Scene from "./Scene";

export default class GameObject {
    name: string;
    transform: Transform;
    components: Array<Component>;

    private static _register: { [name: string]: GameObject } = {};

    static get(name: string) {
        return this._register[name];
    }

    constructor(name: string) {
        this.name = name;
        this.transform = new Transform(this);
        this.components = [];
        GameObject._register[name] = this;
    }

    addChildren(obj: GameObject) {
        this.transform.addChildren(obj.transform);
        return obj;
    }

    addComponent(obj: Component) {
        this.components.push(obj);
        obj.register(this);
        return obj;
    }

    async start() {
        await Promise.all(
            this.transform.children.map((t) => t.gameObject.start())
        );
        await Promise.all(
            this.components.filter((c) => c.isActive).map((c) => c.start())
        );
    }

    async update() {
        await Promise.all(
            this.transform.children.map((t) => t.gameObject.update())
        );
        await Promise.all(
            this.components.filter((c) => c.isActive).map((c) => c.update())
        );
    }

    async lateUpdate() {
        await Promise.all(
            this.transform.children.map((t) => t.gameObject.lateUpdate())
        );
        await Promise.all(
            this.components.filter((c) => c.isActive).map((c) => c.lateUpdate())
        );
    }

    render(renderer: Renderer, camera: Camera) {
        this.transform.children.forEach((t) =>
            t.gameObject.render(renderer, camera)
        );
        this.components.forEach((c) => {
            if (c.isActive) c.render(renderer, camera);
        });
    }

    getScene(): Scene {
        if (this.transform.parent instanceof Transform)
            return this.transform.parent.gameObject.getScene();
        else if (this.transform.parent instanceof Scene)
            return this.transform.parent;
        else throw new Error("Has no parent");
    }

    findMany(name: string) {
        return this.transform.children
            .filter((t) => t.gameObject.name == name)
            .map((t) => t.gameObject);
    }

    find(name: string) {
        return this.transform.children
            .filter((t) => t.gameObject.name == name)
            .map((t) => t.gameObject)[0];
    }

    getComponent<T>(type: Newable<any>) {
        return this.components.filter((c) => c instanceof type) as Array<T>;
    }

    getComponents<T>(type: Newable<any>) {
        return this.components.filter((c) => c instanceof type)[0] as T;
    }
}

type Newable<T> = { new (...args: any[]): T };
