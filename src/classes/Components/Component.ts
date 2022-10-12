import Camera from "../../components/Camera";
import Transform from "../../utilities/Transform";
import VirtualCanvas from "../../utilities/VirtualCanvas";
import GameObject from "../GameObject";
import Renderer from "../Renderer";

export default abstract class Component {
    gameObject!: GameObject;
    get transform(): Transform {
        return this.gameObject.transform;
    }

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
    uiRender(_canvas: VirtualCanvas) {}
}
