import Camera from "../components/Camera";
import Vector3 from "../utilities/math/Vector3";
import { Newable } from "../utilities/Types";
import Colliders from "./Colliders";
import GameObject from "./GameObject";
import Illumination from "./Illumination";
import Renderer from "./Renderer";

export default class Scene {
    name: string;
    children: Array<GameObject>;
    readonly illumination: Illumination;
    readonly colliders: Colliders;

    constructor(name: string) {
        this.name = name;
        this.children = [];
        this.illumination = new Illumination();
        this.colliders = new Colliders();
    }

    getWordPosition() {
        return Vector3.zero;
    }

    addChildren(obj: GameObject) {
        this.children.push(obj);
        obj.transform.setParent(this);
        return obj;
    }

    removeChildren(obj: GameObject) {
        this.children.splice(this.children.indexOf(obj), 1);
        obj.transform.setParent(undefined);
        return obj;
    }

    render(renderer: Renderer, camera: Camera) {
        if (!camera) throw Error("No camera!");

        this.illumination.startFrame(camera);
        this.children.forEach((c) => c.render(renderer, camera));
    }

    async update() {
        await Promise.all(this.children.map((c) => c.update()));
    }

    async lateUpdate() {
        await Promise.all(this.children.map((c) => c.lateUpdate()));
    }

    async awake() {
        await Promise.all(this.children.map((c) => c.awake()));
    }

    find(name: string) {
        return this.children.filter((c) => c.name == name)[0];
        //TODO: add possible return type as undefined
    }

    findMany(name: string) {
        return this.children.filter((c) => c.name == name);
    }

    getAllComponents<T>(type: Newable<any>): Array<T> {
        const res: Array<T> = [];

        this.children.forEach((o) => {
            res.push(...o.getAllComponents<T>(type));
        });
        return res;
    }
}
