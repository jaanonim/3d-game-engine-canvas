import Camera from "../components/Camera";
import Light, { LightType } from "../components/Light";
import Color from "../utilities/Color";
import Vector3 from "../utilities/Vector3";

export default class Illumination {
    lights: Array<Light>;

    constructor() {
        this.lights = [];
    }

    registerLight(light: Light) {
        this.lights.push(light);
    }

    computeLighting(
        camera: Camera,
        point: Vector3,
        normal: Vector3,
        specular: number
    ): [Color, number] {
        let intensity: number[] = [0];
        let color: Color[] = [Color.black];
        let intensity_sum = 0;
        const d = point.invert().normalize();
        const length_n = normal.length();
        const length_v = d.length();

        this.lights.forEach((light) => {
            if (!light.isActive) return;
            if (light.type == LightType.AMBIENT) {
                intensity_sum += light.intensity;
                intensity.push(light.intensity);
                color.push(light.color);
            } else {
                let vec_l;
                const lightPos = camera.transformToCamera(
                    light.gameObject.transform.globalPosition
                );

                if (light.type == LightType.POINT) {
                    vec_l = lightPos.subtract(point);
                } else {
                    vec_l = lightPos;
                }

                const n_dot_l = normal.dotProduct(vec_l);
                if (n_dot_l > 0) {
                    const int =
                        (light.intensity * n_dot_l) /
                        (length_n * vec_l.length());
                    intensity_sum += int;
                    intensity.push(int);
                    color.push(light.color);
                }

                if (specular != -1) {
                    const vec_r = normal
                        .multiply(2.0 * normal.dotProduct(vec_l))
                        .subtract(vec_l);

                    let r_dot_v = vec_r.dotProduct(d);
                    if (r_dot_v > 0) {
                        const int =
                            light.intensity *
                            Math.pow(
                                r_dot_v / (vec_r.length() * length_v),
                                specular
                            );
                        intensity_sum += int;
                        intensity.push(int);
                        color.push(light.color);
                    }
                }
            }
        });
        if (intensity_sum != 0)
            color = color.map((c, i) =>
                c.multiply(intensity[i] / intensity_sum)
            );
        return [color.reduce((p, c) => p.add(c)), intensity_sum];
    }
}
