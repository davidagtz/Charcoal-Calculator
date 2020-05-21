import { Component } from "react";

export default class Canvas<P = {}, S = {}> extends Component<P, S> {
	ctx: CanvasRenderingContext2D;
	height: number;
	width: number;
	_xoff: number;
	_yoff: number;
	_scale: {
		x: number;
		y: number;
	};
	_font = "30px Arial";

	line(x1: number, y1: number, x2: number, y2: number): void {
		this.ctx.beginPath();
		this.ctx.moveTo(this._tX(x1), this._tY(y1));
		this.ctx.lineTo(this._tX(x2), this._tY(y2));
		this.ctx.stroke();
	}

	strokeWeight(w: number): void {
		this.ctx.lineWidth = w;
	}

	stroke(r: number | string, g?: number, b?: number): void {
		if (typeof r === "string") this.ctx.strokeStyle = r;
		else this.ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
	}

	fill(r: number | string, g?: number, b?: number): void {
		if (typeof r === "string") this.ctx.fillStyle = r;
		else this.ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
	}

	rect(x1: number, y1: number, x2: number, y2: number) {
		this.ctx.fillRect(
			this._tX(x1),
			this._tY(y1),
			this._scale.x * x2,
			this._scale.y * y2
		);
	}

	background(r?: number | string, g?: number, b?: number): void {
		if (r) this.fill(r, g, b);
		this.ctx.fillRect(0, 0, this.width, this.height);
	}

	translate(x: number, y: number) {
		this._xoff = x;
		this._yoff = y;
	}

	scale(s: number) {
		this.scaleX(s);
		this.scaleY(s);
	}

	scaleX(x: number) {
		this._scale.x = x;
	}

	scaleY(y: number) {
		this._scale.y = y;
	}

	text(
		str: string,
		x: number,
		y: number,
		mode: "CENTER" | "CORNER" = "CORNER"
	) {
		this.ctx.font = this._font;
		this.ctx.fillText(str, this._tX(x), this._tY(y));
	}

	_tX(x: number) {
		return x * this._scale.x + this._xoff;
	}
	_tY(y: number) {
		return y * this._scale.y + this._yoff;
	}

	textWidth(str: string) {
		return this.ctx.measureText(str).width;
	}

	setup(id: string) {
		const cvs = document.getElementById(id) as HTMLCanvasElement;
		cvs.width = cvs.clientWidth;
		cvs.height = cvs.clientHeight;
		this.width = cvs.width;
		this.height = cvs.height;
		this.ctx = cvs.getContext("2d") as CanvasRenderingContext2D;
	}

	constructor(props: any) {
		super(props);
		this.height = this.width = this._xoff = this._yoff = 0;
		this._scale = {
			x: 1,
			y: 1,
		};
		this.ctx = null as any;
	}
}
