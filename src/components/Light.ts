import Component from "../classes/Components/Component";
import Color from "../utilities/math/Color";
import Vector3 from "../utilities/math/Vector3";

export enum LightType {
    AMBIENT = 0,
    DIRECTIONAL = 1,
    POINT = 2,
}

export default class Light extends Component {
    type: LightType;
    intensity: number;
    color: Color;
    transformedPosition: Vector3;

    constructor(type: LightType, intensity: number, color: Color) {
        super();
        this.type = type;
        this.intensity = intensity;
        this.color = color;
        this.transformedPosition = Vector3.zero;
    }

    async start() {
        this.gameObject.getScene().illumination.registerLight(this);
    }

    async onDestroy(): Promise<void> {
        this.gameObject.getScene().illumination.removeLight(this);
    }
}
