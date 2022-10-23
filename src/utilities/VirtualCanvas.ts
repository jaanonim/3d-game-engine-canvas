export default class VirtualCanvas {
    width: number;
    height: number;
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        const ctx = this.canvas.getContext("2d");
        if (ctx == null) throw Error("Cannot get ctx in VirtualCanvas");
        this.ctx = ctx;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    drawVirtualCanvas(canvas: VirtualCanvas) {
        this.ctx.drawImage(
            canvas.canvas,
            0,
            0,
            canvas.width,
            canvas.height,
            0,
            0,
            this.width,
            this.height
        );
    }
}
