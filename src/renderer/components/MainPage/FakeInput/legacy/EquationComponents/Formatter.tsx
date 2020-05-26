import { ParseNode, TYPE } from "../../../../Tools/brains/Types";
import React from "react";
import Addition from "./Addition";
import Multiplication from "./Multiplication";
import Division from "./Division";
import Subtraction from "./Subtraction";
import Exponent from "./Exponent";
import Parentheses from "./Parentheses";
import Value from "./Value";
require("./EquationComponents.sass");

export function charFormat(
	tree: (ParseNode | null)[],
	id: string = ""
): JSX.Element {
	return (
		<div id={id} className="formatted-output">
			{tree.map((e, i) => _charFormat(e, i))}
		</div>
	);
}

function _charFormat(tree: ParseNode | null, key?: number): JSX.Element | null {
	if (!tree) return null;
	if (tree.type === TYPE.NUMBER)
		return <Value value={tree.value} key={key} />;
	if (tree.type === TYPE.OPERATION) {
		const left = _charFormat(tree.left);
		const right = _charFormat(tree.right);
		switch (tree.value) {
			case "*":
				return (
					<Multiplication
						first={left}
						second={right}
						key={key}
					/>
				);
			case "/":
				return <Division first={left} second={right} key={key} />;
			case "+":
				return <Addition first={left} second={right} key={key} />;
			case "-":
				return (
					<Subtraction first={left} second={right} key={key} />
				);
			case "^":
				return <Exponent first={left} second={right} key={key} />;
		}
	}
	if (tree.type === TYPE.VARIABLE)
		return <Value value={tree.value} key={key} />;
	if (tree.type === TYPE.PARENTHESES) {
		if (tree.value === "(")
			return (
				<Parentheses left={true} right={false} key={key}>
					{_charFormat(tree.left)}
				</Parentheses>
			);
		else
			return (
				<Parentheses left={true} right={true} key={key}>
					{_charFormat(tree.left)}
				</Parentheses>
			);
	}
	if (tree.type === TYPE.UNKNOWN)
		return <Value value={tree.value} key={key} />;
	throw new Error("Node Type not supported");
}

export interface EquationProps {
	first: number | null | string | JSX.Element;
	second: number | null | string | JSX.Element;
}
