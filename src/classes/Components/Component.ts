import Camera from "../../components/Camera";
import Transform from "../../utilities/Transform";
import VirtualCanvas from "../../utilities/VirtualCanvas";
import Event from "../Event";
import GameObject from "../GameObject";
import Renderer from "../Renderer";

export default abstract class Component {
    gameObject!: GameObject;
    onActiveChanges: Event<Component>;
    get transform(): Transform {
        return this.gameObject.transform;
    }

    private _isActive: boolean;
    public get isActive(): boolean {
        return this._isActive;
    }
    public set isActive(value: boolean) {
        this._isActive = value;
        this.onActiveChanges.call(this);
    }

    constructor() {
        this._isActive = true;
        this.onActiveChanges = new Event<Component>();
    }

    /**
     * Called when component added to GameObject
     * @param obj GameObject
     */
    register(obj: GameObject) {
        this.gameObject = obj;
    }

    /**
     * Destroy component
     */
    destroy() {
        this.gameObject.removeComponent(this);
        //this.gameObject = null; //! I hate TypeScript
        this.onDestroy();
    }

    /**
     * Called on scene load
     */
    async awake() {}

    /**
     * Called when object is created
     */
    async start() {}

    /**
     * Called every frame before render
     */
    async update() {}

    /**
     * Called every frame after render
     */
    async lateUpdate() {}

    /**
     * Called when component is destroyed
     */
    async onDestroy() {}

    /**
     * Used for rendering
     * @param _renderer
     * @param _camera
     */
    render(_renderer: Renderer, _camera: Camera) {}

    /**
     * Used for rendering UI
     * @param _canvas
     */
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
