import Vector3 from "./Vector3";

export interface Sphere {
    center: Vector3;
    radius: number;
}

export function degToRad(deg: number) {
    return deg * (Math.PI / 180);
}

export function interpolate(i0: number, d0: number, i1: number, d1: number) {
    if (i0 == i1) {
        return [d0];
    }
    const values: number[] = [];
    const a = (d1 - d0) / (i1 - i0);
    let d = d0;
    for (let i = i0; i <= i1; i++) {
        values.push(d);
        d = d + a;
    }
    return values;
}

export function getInterpolatedValues(
    k1: number,
    k2: number,
    k3: number,
    v1: number,
    v2: number,
    v3: number
) {
    const v12 = interpolate(v1, k1, v2, k2);
    const v23 = interpolate(v2, k2, v3, k3);
    const v13 = interpolate(v1, k1, v3, k3);

    v12.pop();
    const v123 = [...v12];
    v123.push(...v23);
    return [v123, v13];
}

export function map(
    v: number,
    minIn: number,
    maxIn: number,
    minOut: number,
    maxOut: number
): number {
    return ((v - minIn) * (maxOut - minOut)) / (maxIn - minIn) + minIn;
}

export function clamp(v: number, min: number = 0, max: number = 1) {
    if (v < min) v = min;
    if (v > max) v = max;
    return v;
}
