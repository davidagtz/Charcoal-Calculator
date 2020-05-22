import React, { CSSProperties } from "react";
import ErrorFreeParser from "../../Tools/brains/ErrorFreeParser";
import { charFormat } from "./EquationComponents/Formatter";
// import Parser, { isFunction } from '../../Tools/brains/Parser';
// import { toTex } from '../../Tools/brains/Calculator';
require("./FakeInput.sass");

export default class FakeInput extends React.Component<{
	style: CSSProperties;
	id: string;
}> {
	interval = null as null | NodeJS.Timeout;
	state = {
		text: "",
	};
	x = 0;
	render() {
		const parser = new ErrorFreeParser(this.state.text);
		return (
			<div
				id={this.props.id}
				className="fake-input"
				style={this.props.style}
				onMouseDown={this.focus}
			>
				<textarea
					id={this.props.id + "-text"}
					className="hide-text"
					onChange={this.changeText}
					onBlur={this.blur}
					onKeyUp={this.putCursor}
					onFocus={this.putCursor}
				/>
				<span id={this.props.id + "-span"}>
					<div id="cursor"></div>
					{charFormat(parser.parseAll(), "fo-1")}
				</span>
			</div>
		);
	}
	componentDidMount = this.componentDidUpdate;

	changeText = () => {
		const text = document.getElementById(
			this.props.id + "-text"
		) as HTMLTextAreaElement;
		this.setState({
			text: text.value,
		});
	};
	componentDidUpdate() {
		if (this.interval) clearInterval(this.interval);
		this.interval = setInterval(() => {
			const cursor = document.getElementById(
				"cursor"
			) as HTMLDivElement;
			if (cursor)
				if (cursor.className === "") {
					cursor.className = "active";
				} else {
					cursor.className = "";
				}
		}, 500);
	}

	putCursor = () => {
		const eq = document.getElementById("fo-1") as HTMLDivElement;
		const cursor = document.getElementById("cursor") as HTMLDivElement;

		const find = this.getTextArea().selectionStart;
		let index = 0;
		this.x = cursor.clientWidth;

		if (find === 0 && eq.children.length === 0) {
			cursor.style.left = "0";
			return;
		}

		_put.bind(this)(eq);

		function _put(this: any, el: Element): boolean {
			for (let i = 0; i < el.children.length; i++) {
				const child = el.children[i];
				const value = child.innerHTML;
				const innerI = find - index;

				if (child.className === "format-value") {
					if (index <= find && find <= index + value.length) {
						const nX = this.textWidth(
							value.substring(0, innerI),
							getComputedStyle(child).font
						);
						cursor.style.left = this.x + nX + "px";

						return true;
					}
					this.x += child.clientWidth;
					index += value.length;
				} else if (child.className === "sign") {
					const nX = child.getBoundingClientRect().width;
					if (index <= find && find <= index + 1) {
						cursor.style.left = this.x + nX + "px";
						return true;
					}
					this.x += nX;
					index++;
				} else {
					if (_put.bind(this)(child)) return true;
				}
			}
			return false;
		}
		// const nC = document.createElement("div");
		// if (cursor) {
		// 	cursor.remove();
		// }
		// nC.id = "cursor";
		// } else if (child.className === "sign") {
		// 	if (index <= find && find <= index + value.length) {
		// 		const nX = this.textWidth(
		// 			value.substring(0, innerI),
		// 			getComputedStyle(child).font
		// 		);
		// 		cursor!.style.left = this.x + nX + "px";
		// 		// nC.style.left = nX + "px";
		// 		// x += nX;
		// 		// cursor!.style.left = x + "px";

		// 		// child.prepend(nC);

		// 		return true;
		// 	}
		// 	this.x += child.clientWidth;
		// 	index += value.length;
	};

	fakeEl: HTMLElement | null = null;
	textWidth(str: string, font: string) {
		if (!this.fakeEl) {
			const fake = document.createElement("span");
			this.fakeEl = fake;
			document.body.append(this.fakeEl);
		}
		this.fakeEl.innerHTML = str;
		this.fakeEl.style.font = font;
		return this.fakeEl.offsetWidth;
	}

	getTextArea = () =>
		document.getElementById(
			this.props.id + "-text"
		) as HTMLTextAreaElement;

	blur = () => {
		// document.getElementById("cursor")!.remove();
	};

	focus = () => {
		const input = this.getTextArea();
		setTimeout(() => {
			input.focus();
		}, 0);
	};
	componentWillUnmount() {
		if (this.interval) clearInterval(this.interval);
		// this.blur = () => {};
		// const text = document.getElementById(this.props.id + "-text");
		// if (text) {
		// 	text.onblur = null;
		// 	text.onchange = null;
		// }
	}
	format = () => {
		// const parser = new ErrorFreeParser(this.state.text);
		// const span = document.getElementById(
		// 	this.props.id + "-span"
		// ) as HTMLSpanElement;
		// span.innerHTML = charFormat(parser.parseAll());
		//    try {
		//        const tree = parser.parse();
		//        let tex = toTex(tree);
		//        let result = 0;
		//        const span = document.getElementById(this.props.id + '-span') as HTMLSpanElement;
		//        span.innerHTML = tex;
		//   const errors = this.state.error;
		//   errors[rowNumber] = false;
		//   const results = this.state.value;
		//   results[rowNumber] = result;
		//   this.setState({ error: errors, value: results, html: tex });
		//    } catch (e) {
		//   const errors = this.state.error;
		//   if (i.value.trim() !== '') errors[rowNumber] = true;
		//   else errors[rowNumber] = false;
		//   const results = this.state.value;
		//   results[rowNumber] = 0;
		//   this.setState({ error: errors, result: results, html: '' });
		//   this.props.changeExpression(rowNumber, null);
		//   console.error(e);
		//    }
	};
}
