import React, { CSSProperties } from "react";
import ErrorFreeParser from "../../Tools/brains/ErrorFreeParser";
import { charFormat } from "./EquationComponents/Formatter";
import Canvas from "../../Tools/Canvas";
import { ParseNode, TYPE } from "../../Tools/brains/Types";
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
		this.ctx.imageSmoothingEnabled = false;
		this.em = this.height;
		this.strokeWeight(0);

		this.translate(0, this.height);
		this.scaleY(-1);

		this.fill("#000");
		this.drawTree();
	}

	drawTree = () => {
		const start = this.getTextArea().selectionStart;

		let index = 0;
		let x = 0;
		let y = 0;

		this.tree.forEach((e) => (e ? _drawTree.bind(this)(e) : null));

		function _drawTree(this: any, node: ParseNode, size: number = 1) {
			if (
				node.type === TYPE.NUMBER ||
				node.type === TYPE.VARIABLE ||
				node.type === TYPE.UNKNOWN
			) {
				this._font = `${size * this.em}px Arial`;

				this.text(node.value as string, x, y);
				const length = (node.value + "").length;

				if (index <= start && start <= index + length) {
					this.clearCursor();
					this.cursor.x =
						x +
						this.textWidth(
							("" + node.value).substring(0, start - index)
						);
					this.drawCursor();
				}

				x += this.textWidth(node.value as string);
				index += length;
				return;
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

	drawCursor(size: number = 1) {
		this.fill("#000");
		this.rect(
			this.cursor.x,
			this.cursor.y + size * this.em,
			2,
			this.cursor.y
		);
	}
	clearCursor(size: number = 1) {
		this.fill("#fff");
		this.rect(
			this.cursor.x,
			this.cursor.y + size * this.em,
			2,
			this.cursor.y
		);
	}

	getTextArea() {
		return document.getElementById(
			this.props.id + "-text"
		) as HTMLTextAreaElement;
	}

	componentDidMount = this.componentDidUpdate;
}
