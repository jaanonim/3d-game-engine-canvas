import Light, { LightType } from "../components/Light";
import Vector3 from "../utilities/Vector3";

export default class Illumination {
    lights: Array<Light>;

    constructor() {
        this.lights = [];
    }

    registerLight(light: Light) {
        this.lights.push(light);
    }

    computeLighting(point: Vector3, normal: Vector3, specular: number) {
        let intensity = 0;
        const d = point.invert();
        const length_n = normal.length();
        const length_v = d.length();

        this.lights.forEach((light) => {
            if (!light.isActive) return;
            if (light.type == LightType.AMBIENT) {
                intensity += light.intensity;
            } else {
                let vec_l;
                if (light.type == LightType.POINT) {
                    vec_l =
                        light.gameObject.transform.globalPosition.subtract(
                            point
                        );
                } else {
                    vec_l = light.gameObject.transform.globalPosition;
                }

                let n_dot_l = normal.dotProduct(vec_l);
                if (n_dot_l > 0) {
                    intensity +=
                        (light.intensity * n_dot_l) /
                        (length_n * vec_l.length());
                }

                if (specular != -1) {
                    let vec_r = normal
                        .multiply(2.0 * normal.dotProduct(vec_l))
                        .subtract(vec_l);

                    let r_dot_v = vec_r.dotProduct(d);
                    if (r_dot_v > 0) {
                        intensity +=
                            light.intensity *
                            Math.pow(
                                r_dot_v / (vec_r.length() * length_v),
                                specular
                            );
                    }
                }
            }
        });
        return intensity;
    }
}
