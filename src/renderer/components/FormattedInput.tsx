import React, { Component } from "react";
import Parser from "./brains/Parser";
const { loadAndTypeset } = require("mathjax-electron");
require("../styles/FormattedInput.sass");

export default class FormattedInput extends Component {
	state = {
		html: "$$E = c^{\\frac {3}{5}}$$",
	};
	constructor(props: any) {
		super(props);
		loadAndTypeset(document);
	}
	inputChange() {
		const i: any = document.getElementById("f");
		let parser = new Parser(i!.value);
		console.log(parser.parse());
		// this.setState({
		// 	html: i!.value,
		// });
		// MathJax.Hub.Queue([
		// 	"Typeset",
		// 	MathJax.Hub,
		// 	document.getElementById("to-format"),
		// ]);
	}
	render() {
		const inp = <input id="f" onChange={this.inputChange} />;

		return (
			<div className="formatted-input">
				{inp}
				<p id="to-format">{this.state.html}</p>
			</div>
		);
	}
}
