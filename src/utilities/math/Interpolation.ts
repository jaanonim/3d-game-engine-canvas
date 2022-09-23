import Color from "./Color";
import Vector3 from "./Vector3";

export type Iterpolatable = number | Color | Vector3;

export function interpolateNumber(
    i0: number,
    d0: number,
    i1: number,
    d1: number
) {
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

export function interpolateVector3(
    k1: Vector3,
    k2: Vector3,
    v1: number,
    v2: number
): Array<Vector3> {
    const x = interpolateNumber(v1, k1.x, v2, k2.x);
    const y = interpolateNumber(v1, k1.y, v2, k2.y);
    const z = interpolateNumber(v1, k1.z, v2, k2.z);

    const res = [];
    for (let i = 0; i < x.length; i++) {
        res.push(new Vector3(x[i], y[i], z[i]));
    }
    return res;
}

export function interpolateColor(
    k1: Color,
    k2: Color,
    v1: number,
    v2: number
): Array<Color> {
    const r = interpolateNumber(v1, k1.r, v2, k2.r);
    const g = interpolateNumber(v1, k1.g, v2, k2.g);
    const b = interpolateNumber(v1, k1.b, v2, k2.b);
    const a = interpolateNumber(v1, k1.a, v2, k2.a);

    const res = [];
    for (let i = 0; i < r.length; i++) {
        res.push(new Color(r[i], g[i], b[i], a[i]));
    }
    return res;
}

export function interpolateValue(
    k1: Iterpolatable,
    k2: Iterpolatable,
    v1: number,
    v2: number
): Array<Iterpolatable> {
    if (k1 instanceof Vector3) {
        return interpolateVector3(k1 as Vector3, k2 as Vector3, v1, v2);
    } else if (k1 instanceof Color) {
        return interpolateColor(k1 as Color, k2 as Color, v1, v2);
    } else {
        return interpolateNumber(v1, k1 as number, v2, k2 as number);
    }
}

export function getInterpolatedValue(
    k1: Iterpolatable,
    k2: Iterpolatable,
    k3: Iterpolatable,
    v1: number,
    v2: number,
    v3: number
) {
    if (k1 instanceof Vector3) {
        return getInterpolatedVector3(
            k1 as Vector3,
            k2 as Vector3,
            k3 as Vector3,
            v1,
            v2,
            v3
        );
    } else if (k1 instanceof Color) {
        return getInterpolatedColor(
            k1 as Color,
            k2 as Color,
            k3 as Color,
            v1,
            v2,
            v3
        );
    } else {
        return getInterpolatedNumber(
            k1 as number,
            k2 as number,
            k3 as number,
            v1,
            v2,
            v3
        );
    }
}

export function getInterpolatedNumber(
    k1: number,
    k2: number,
    k3: number,
    v1: number,
    v2: number,
    v3: number
) {
    const v12 = interpolateNumber(v1, k1, v2, k2);
    const v23 = interpolateNumber(v2, k2, v3, k3);
    const v13 = interpolateNumber(v1, k1, v3, k3);

    v12.pop();
    const v123 = [...v12];
    v123.push(...v23);
    return [v123, v13];
}

export function getInterpolatedVector3(
    k1: Vector3,
    k2: Vector3,
    k3: Vector3,
    v1: number,
    v2: number,
    v3: number
): [Array<Vector3>, Array<Vector3>] {
    const [x123, x13] = getInterpolatedNumber(k1.x, k2.x, k3.x, v1, v2, v3);
    const [y123, y13] = getInterpolatedNumber(k1.y, k2.y, k3.y, v1, v2, v3);
    const [z123, z13] = getInterpolatedNumber(k1.z, k2.z, k3.z, v1, v2, v3);

    const res123 = [];
    const res13 = [];
    for (let i = 0; i < x123.length; i++) {
        res123.push(new Vector3(x123[i], y123[i], z123[i]));
    }
    for (let i = 0; i < x13.length; i++) {
        res13.push(new Vector3(x13[i], y13[i], z13[i]));
    }
    return [res123, res13];
}

export function getInterpolatedColor(
    k1: Color,
    k2: Color,
    k3: Color,
    v1: number,
    v2: number,
    v3: number
): [Array<Color>, Array<Color>] {
    const [r123, r13] = getInterpolatedNumber(k1.r, k2.r, k3.r, v1, v2, v3);
    const [g123, g13] = getInterpolatedNumber(k1.g, k2.g, k3.g, v1, v2, v3);
    const [b123, b13] = getInterpolatedNumber(k1.b, k2.b, k3.b, v1, v2, v3);
    const [a123, a13] = getInterpolatedNumber(k1.a, k2.a, k3.a, v1, v2, v3);

    const res123 = [];
    const res13 = [];
    for (let i = 0; i < r123.length; i++) {
        res123.push(new Color(r123[i], g123[i], b123[i], a123[i]));
    }
    for (let i = 0; i < r13.length; i++) {
        res13.push(new Color(r13[i], g13[i], b13[i], a13[i]));
    }
    return [res123, res13];
}
