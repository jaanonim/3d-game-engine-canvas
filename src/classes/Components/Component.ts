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

    destroy() {
        this.gameObject.removeComponent(this);
        //this.gameObject = null; //! I hate TypeScript
        this.onDestroy();
    }

    async awake() {}
    async start() {}
    async update() {}
    async lateUpdate() {}
    async onDestroy() {}
    render(_renderer: Renderer, _camera: Camera) {}
    uiRender(_canvas: VirtualCanvas) {}

    /**
     * Utility function for logging.
     * Logs using console.log and appends info about gameObject and component
     * @param obj thing to log
     */
    log(...obj: any) {
        console.log(
            `%c${this.gameObject.name}<${this.constructor.name}>:`,
            "color:green; font-weight:bold;",
            ...obj
        );
    }

    /**
     * Utility function for logging.
     * Logs using console.error and appends info about gameObject and component
     * @param obj thing to log
     */
    error(...obj: any) {
        console.error(
            `%c${this.gameObject.name}<${this.constructor.name}>:`,
            "color:red; font-weight:bold;",
            ...obj
        );
    }

    /**
     * Utility function for logging.
     * Logs using console.warn and appends info about gameObject and component
     * @param obj thing to log
     */
    warn(...obj: any) {
        console.warn(
            `%c${this.gameObject.name}<${this.constructor.name}>:`,
            "color:orange; font-weight:bold;",
            ...obj
        );
    }
}
