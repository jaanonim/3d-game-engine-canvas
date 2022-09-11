import Drawer from ".";
import Color from "../../utilities/Color";
import Vector2 from "../../utilities/Vector2";

export default class DrawerStandard extends Drawer {
    drawTriangleWireframe(p1: Vector2, p2: Vector2, p3: Vector2, color: Color) {
        this.ctx.strokeStyle = color.getHex();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.lineTo(p3.x, p3.y);
        this.ctx.lineTo(p1.x, p1.y);
    }

    begin() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.beginPath();
    }

    end() {
        this.ctx.closePath();
        this.ctx.stroke();
    }
}
