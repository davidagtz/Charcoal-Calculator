import React, { Component } from "react";
import Parser from "./brains/Parser";
import calculate, { toTex } from "./brains/Calculator";
const { loadAndTypeset } = require("mathjax-electron");
require("../styles/FormattedInput.sass");

export default class FormattedInput extends Component {
	state = {
		html: "$$E = c^{\\frac {3}{5}}$$",
		error: null,
		value: null,
	};
	constructor(props: any) {
		super(props);
		loadAndTypeset(document);
		this.inputChange = this.inputChange.bind(this);
		this.componentDidMount = this.componentDidUpdate;
	}

	inputChange() {
		const i: any = document.getElementById("f");
		let parser = new Parser(i!.value);
		try {
			let tree = parser.parse();
			let tex = "";
			let result = 0;
			if (tree) {
				result = calculate(tree);
				tex = toTex(tree);
				console.log("tex: ", tex);
			}
			this.setState({ error: null, value: result, html: tex });
		} catch (e) {
			this.setState({ error: e.message, result: null, html: "" });
			// console.error(e);
		}
	}

	componentDidUpdate() {
		MathJax.Hub.Queue([
			"Typeset",
			MathJax.Hub,
			document.getElementById("to-format"),
		]);
	}
	render() {
		const inp = (
			<input
				id="f"
				className={this.state.error ? " error" : ""}
				onChange={this.inputChange}
			/>
		);

		return (
			<div className="formatted-input">
				<div>
					{inp}
					<div
						className={
							"ans" + (this.state.error ? " error" : "")
						}
					>
						{this.state.error ? "" : "=" + this.state.value}
					</div>
				</div>
				<p id="to-format">{this.state.html}</p>
			</div>
		);
	}
}
