import React, { CSSProperties } from "react";
import ErrorFreeParser from "../../../Tools/brains/ErrorFreeParser";
import Canvas from "../../../Tools/Canvas";
import { ParseNode, TYPE } from "../../../Tools/brains/Types";
require("./CanvasInput.sass");

export default class CanvasInput extends Canvas<{
	style?: CSSProperties;
	id: string;
}> {
	interval = null as null | NodeJS.Timeout;
	isFocused = false;
	input = "";
	cursor = {
		x: 0,
		y: 0,
		height: 1,
		active: false,
	};
	em = 0;
	tree: (ParseNode | null)[] = [];
	render() {
		return (
			<div
				id={this.props.id}
				className="canvas-input"
				style={this.props.style}
				onMouseDown={this.focus}
			>
				<textarea
					id={this.props.id + "-text"}
					className="hide-text"
					onChange={this.changeText}
					onBlur={this.blur}
					onKeyUp={() => this.componentDidUpdate()}
				/>
				<canvas
					className="cin"
					id={this.props.id + "-canvas"}
					onMouseUp={this.focus}
				/>
			</div>
		);
	}

	changeText = () => {
		const text = document.getElementById(
			this.props.id + "-text"
		) as HTMLTextAreaElement;
		this.input = text.value;
		const parser = new ErrorFreeParser(this.input);
		this.tree = parser.parseAll();
		this.componentDidUpdate();
	};
	componentDidUpdate() {
		this.setup(this.props.id + "-canvas");
		this.ctx.imageSmoothingEnabled = true;
		this.em = (2 * this.height) / 3;
		this.strokeWeight(0);

		this.translate(0, this.height - (1.1 * this.em) / 3);
		this.scaleY(-1);

		this.fill("#000");
		this.drawTree();
	}

	drawTree = () => {
		this.cursor.x = 0;
		this.cursor.y = 0;

		const start = this.getTextArea().selectionStart;

		let index = 0;
		let x = 0;
		let y = 0;
		let hasDrawn = false;

		this.tree.forEach((e) => (e ? draw.bind(this)(e) : null));

		function draw(this: any, node: ParseNode, size: number = 1) {
			this._font = `${size * this.em}px Helvetica`;
			if (
				node.type === TYPE.NUMBER ||
				node.type === TYPE.VARIABLE ||
				node.type === TYPE.UNKNOWN
			) {
				putCursor.bind(this)(node.value + "");
			} else if (node.type === TYPE.OPERATION) {
				if (node.value === "+" || node.value === "-") {
					if (node.left) draw.bind(this)(node.left, size);

					putCursor.bind(this)(node.value as string);

					if (node.right) draw.bind(this)(node.right, size);
				} else if (node.value === "*") {
					if (node.left) draw.bind(this)(node.left, size);

					const pY = y;
					y += (size * this.em) / 4;
					putCursor.bind(this)(".");
					y = pY;

					if (node.right) draw.bind(this)(node.right, size);
				} else if (node.value === "^") {
					if (node.left) draw.bind(this)(node.left, size);

					const pY = y;
					y += (size * this.em) / 2;
					if (
						!hasDrawn &&
						index <= start &&
						start <= index + 1
					) {
						this.clearCursor();
						this.cursor.x = x;
						this.cursor.y = y;
						this.cursor.height = size / 2;
						this.drawCursor();
						hasDrawn = true;
					}
					index++;

					if (node.right) draw.bind(this)(node.right, size / 2);

					y = pY;
				}
			}
			function putCursor(this: any, str: string) {
				this.text(str, x, y);
				const length = str.length;

				if (
					!hasDrawn &&
					index <= start &&
					start <= index + length
				) {
					this.clearCursor();
					this.cursor.x =
						x +
						this.textWidth(str.substring(0, start - index));
					this.cursor.y = y;
					this.cursor.height = size;
					this.drawCursor();
					hasDrawn = true;
				}
				x += this.textWidth(str);
				index += length;
			}
		}
	};

	blur = () => {
		this.clearCursor();
		if (this.interval) {
			clearInterval(this.interval);
			this.interval = null;
		}
		this.isFocused = false;
		this.componentDidUpdate();
	};

	focus = () => {
		const input = document.getElementById(
			this.props.id + "-text"
		) as HTMLTextAreaElement;

		input.focus();
		this.isFocused = true;
		this.componentDidUpdate();

		if (!this.interval)
			this.interval = setInterval(() => {
				if (this.cursor.active) {
					this.drawCursor();
				} else {
					this.clearCursor();
				}
				this.cursor.active = !this.cursor.active;
			}, 750);
	};

	drawCursor() {
		this.fill("#000");
		this.rect(
			this.cursor.x,
			this.cursor.y,
			2,
			this.cursor.height * this.em
		);
	}
	clearCursor() {
		this.fill("#fff");
		this.rect(
			this.cursor.x,
			this.cursor.y,
			2,
			this.cursor.height * this.em
		);
	}

	getTextArea() {
		return document.getElementById(
			this.props.id + "-text"
		) as HTMLTextAreaElement;
	}

	componentDidMount = this.componentDidUpdate;
}
