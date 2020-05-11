import { Component } from 'React';

export default class Canvas<P = {}, S = {}> extends Component<P, S> {
    ctx: any;
    height: number;
    width: number;
    _xoff: number;
    _yoff: number;

    line(x1: number, y1: number, x2: number, y2: number): void {
        this.ctx.beginPath();
        this.ctx.moveTo(x1 + this._xoff, y1 + this._yoff);
        this.ctx.lineTo(x2 + this._xoff, y2 + this._yoff);
        this.ctx.stroke();
    }

    strokeWeight(w: number): void {
        this.ctx.lineWidth = w;
    }

    stroke(r: number | string, g?: number, b?: number): void {
        if (typeof r === 'string') this.ctx.strokeStyle = r;
        else this.ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
    }

    fill(r: number | string, g?: number, b?: number): void {
        if (typeof r === 'string') this.ctx.fillStyle = r;
        else this.ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    }

    rect(x1: number, y1: number, x2: number, y2: number) {
        this.ctx.fillRect(x1, y1, x2, y2);
    }

    background(r?: number | string, g?: number, b?: number): void {
        if (r) this.fill(r, g, b);
        this.rect(0, 0, this.width, this.height);
    }

    translate(x: number, y: number) {
        this._xoff = x;
        this._yoff = y;
    }

    constructor(props: any) {
        super(props);
        this.height = this.width = this._xoff = this._yoff = 0;
    }
}
