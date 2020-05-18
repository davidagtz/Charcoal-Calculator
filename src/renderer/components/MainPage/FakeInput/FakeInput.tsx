import React, { CSSProperties } from "react";
import ErrorFreeParser from "../../Tools/brains/ErrorFreeParser";
import ErrorFreeTexer from "../../Tools/brains/ErrorFreeTexer";
// import Parser, { isFunction } from '../../Tools/brains/Parser';
// import { toTex } from '../../Tools/brains/Calculator';
require("./FakeInput.sass");

export default class FakeInput extends React.Component<{
	style: CSSProperties;
	id: string;
}> {
	interval = null as null | NodeJS.Timeout;
	state = {
		isFocused: false,
		text: "",
	};
	render() {
		const cursor = <div id="cursor" />;
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
				/>
				<span id={this.props.id + "-span"}>{this.state.text}</span>
				{this.state.isFocused ? cursor : null}
			</div>
		);
	}
	componentDidMount = this.componentDidUpdate;

	changeText = () => {
		const text = document.getElementById(
			this.props.id + "-text"
		) as HTMLTextAreaElement;
		this.setState(
			{
				text: text.value,
			},
			this.format
		);
	};
	componentDidUpdate() {
		if (this.interval) clearInterval(this.interval);
		const cursor = document.getElementById("cursor") as HTMLDivElement;
		if (cursor) {
			this.interval = setInterval(() => {
				if (!cursor) clearInterval(this.interval!);
				if (cursor.className === "") cursor.className = "active";
				else cursor.className = "";
			}, 500);
		}
	}
	blur = () => {
		this.setState({
			isFocused: false,
		});
	};
	focus = (e: any) => {
		const input = document.getElementById(
			this.props.id + "-text"
		) as HTMLTextAreaElement;
		setTimeout(() => {
			input.focus();
			this.setState({
				isFocused: true,
			});
		}, 0);
	};
	constructor(props: any) {
		super(props);
	}
	format = () => {
		const parser = new ErrorFreeParser(this.state.text);
		const span = document.getElementById(
			this.props.id + "-span"
		) as HTMLSpanElement;
		span.innerHTML = ErrorFreeTexer(parser.parseAll());
		MathJax.Hub.Queue(["Typeset", MathJax.Hub, span]);
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
