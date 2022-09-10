import Vector3 from "./Vector3";

export interface Sphere {
    center: Vector3;
    radius: number;
}

export function degToRad(deg: number) {
    return deg * (Math.PI / 180);
}
