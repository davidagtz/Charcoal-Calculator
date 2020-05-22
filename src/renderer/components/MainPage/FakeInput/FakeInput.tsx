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

		const cursor = document.getElementById("cursor");
		if (cursor) {
			cursor.remove();
		}

		const find = this.getTextArea().selectionStart;
		let index = 0;
		let beenFound = false;

		if (find === 0 && eq.children.length === 0) {
			const nC = document.createElement("div");
			nC.id = "cursor";
			nC.style.left = "0px";

			eq.prepend(nC);
			return;
		}

		_put.bind(this)(eq);

		function _put(this: any, el: HTMLElement): boolean {
			for (let i = 0; i < el.children.length; i++) {
				const child = el.children[i];
				if (child.className === "format-value") {
					const value = child.innerHTML;
					if (
						!beenFound &&
						index <= find &&
						find <= index + value.length
					) {
						const nC = document.createElement("div");
						nC.id = "cursor";

						const innerI = find - index;
						nC.style.left =
							this.textWidth(
								value.substring(0, innerI),
								getComputedStyle(child).font
							) + "px";

						console.log(
							this.textWidth(
								value.substring(0, innerI),
								getComputedStyle(child).fontSize
							),
							getComputedStyle(child).fontSize
						);

						child.prepend(nC);

						beenFound = true;
					}
					index += value.length;
				}
			}
			return false;
		}
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
		document.getElementById("cursor")!.remove();
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
