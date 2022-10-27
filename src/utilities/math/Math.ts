import Vector3 from "./Vector3";

export interface Sphere {
    center: Vector3;
    radius: number;
}

export function degToRad(deg: number) {
    return deg * (Math.PI / 180);
}

export function map(
    v: number,
    minIn: number,
    maxIn: number,
    minOut: number,
    maxOut: number
): number {
    return ((v - minIn) * (maxOut - minOut)) / (maxIn - minIn) + minOut;
}

export function clamp(v: number, min: number = 0, max: number = 1) {
    if (v < min) v = min;
    if (v > max) v = max;
    return v;
}

export function sigmoid(v: number) {
    return (1 / (1 + Math.exp(-v))) * 2 - 1;
}
