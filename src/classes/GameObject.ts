import Camera from "../components/Camera";
import Transform from "../utilities/Transform";
import { Newable } from "../utilities/Types";
import Component from "./Components/Component";
import SizedComponent from "./Components/SizedComponent";
import UiComponent from "./Components/UiComponent";
import Renderer from "./Renderer";
import Scene from "./Scene";

export default class GameObject {
    public name: string;
    public transform: Transform;
    private components: Array<Component>;
    private _isStarted: boolean = false;
    public get isStarted(): boolean {
        return this._isStarted;
    }

    constructor(name: string) {
        this.name = name;
        this.transform = new Transform(this);
        this.components = [];
        this._isStarted = false;
    }

    addChildren(obj: GameObject, atStart = false) {
        this.transform.addChildren(obj.transform, atStart);
        obj._isStarted = false;
        return obj;
    }

    removeChildren(obj: GameObject) {
        this.transform.removeChildren(obj.transform);
    }

    addComponent(obj: Component) {
        this.components.push(obj);
        obj.register(this);
        return obj;
    }

    removeComponent(obj: Component) {
        this.components.splice(this.components.indexOf(obj), 1);
        obj.onDestroy();
    }

    getChildren() {
        return this.transform.children.map((t) => t.gameObject);
    }

    async start() {
        await Promise.all(
            this.components.filter((c) => c.isActive).map((c) => c.start())
        );
        await Promise.all(
            this.transform.children.map((t) => t.gameObject.start())
        );
        this._isStarted = true;
    }

    async update() {
        if (!this.isStarted) await this.start();
        await Promise.all(
            this.components.filter((c) => c.isActive).map((c) => c.update())
        );
        await Promise.all(
            this.transform.children.map((t) => t.gameObject.update())
        );
    }

    async lateUpdate() {
        if (!this.isStarted) return;
        await Promise.all(
            this.components.filter((c) => c.isActive).map((c) => c.lateUpdate())
        );
        await Promise.all(
            this.transform.children.map((t) => t.gameObject.lateUpdate())
        );
    }

    async awake() {
        await Promise.all(
            this.components.filter((c) => c.isActive).map((c) => c.awake())
        );
        await Promise.all(
            this.transform.children.map((t) => t.gameObject.awake())
        );
    }

    render(renderer: Renderer, camera: Camera) {
        if (!this.isStarted) return;
        this.components.forEach((c) => {
            if (c.isActive) c.render(renderer, camera);
        });
        this.transform.children.forEach((t) =>
            t.gameObject.render(renderer, camera)
        );
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
        //TODO: add possible return type as undefined
    }

    getComponents<T>(type: Newable<any>) {
        return this.components.filter((c) => c instanceof type) as Array<T>;
    }

    getComponent<T>(type: Newable<any>): T | undefined {
        return this.components.filter((c) => c instanceof type)[0] as T;
    }

    getComponentError<T>(type: Newable<any>): T {
        const c = this.components.filter((c) => c instanceof type)[0] as T;
        if (!c) throw Error(`Component ${type} not found on ${this.name}`);
        return c;
    }

    getAllComponents<T>(type: Newable<any>): Array<T> {
        const res: Array<T> = [];
        this.transform.children.forEach((t) => {
            res.push(...t.gameObject.getAllComponents<T>(type));
        });
        res.push(...this.getComponents<T>(type));
        return res;
    }

    getUiComponents(): Array<UiComponent> {
        return this.components.filter(
            (c) => c instanceof UiComponent
        ) as Array<UiComponent>;
    }

    getSizedComponent(): SizedComponent | undefined {
        return this.components.filter(
            (c) => c instanceof SizedComponent
        )[0] as SizedComponent;
    }

    async destroy() {
        if (!this.transform.parent) throw new Error("No parent");
        await this.onDestroy();
        (this.transform.parent instanceof Scene
            ? this.transform.parent
            : this.transform.parent.gameObject
        ).removeChildren(this);
    }

    async onDestroy() {
        await Promise.all(
            this.components.filter((c) => c.isActive).map((c) => c.onDestroy())
        );
        await Promise.all(
            this.transform.children.map((t) => t.gameObject.onDestroy())
        );
    }
}
