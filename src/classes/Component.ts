import Camera from "../components/Camera";
import GameObject from "./GameObject";
import Renderer from "./Renderer";

export default abstract class Component {
    gameObject!: GameObject;

    private _isActive: boolean;
    public get isActive(): boolean {
        return this._isActive;
    }
    public set isActive(value: boolean) {
        this._isActive = value;
    }

    constructor() {
        this._isActive = true;
    }

    register(obj: GameObject) {
        this.gameObject = obj;
    }

    async start() {}
    async update() {}
    async lateUpdate() {}
    render(_renderer: Renderer, _camera: Camera) {}
}
