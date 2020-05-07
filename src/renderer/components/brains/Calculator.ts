import { ParseNode, TYPE } from "./Types";
export default function calculate(tree: ParseNode): number {
	if (tree.type === TYPE.NUMBER) return tree.value as number;
	if (tree.type === TYPE.OPERATION) {
		let left = calculate(tree.left!);
		let right = calculate(tree.right!);
		switch (tree.value) {
			case "*":
				return left * right;
			case "/":
				return left / right;
			case "+":
				return left + right;
			case "-":
				return left - right;
			case "^":
				return Math.pow(left, right);
		}
	}
	throw new Error("Node Type not supported");
}

export function toTex(tree: ParseNode): string {
	return "$$" + texize(tree) + "$$";
}

function texize(tree: ParseNode): string {
	if (tree.type === TYPE.NUMBER) return "" + tree.value;
	if (tree.type === TYPE.OPERATION) {
		let left = texize(tree.left!);
		let right = texize(tree.right!);
		switch (tree.value) {
			case "*":
				return `${left}*${right}`;
			case "/":
				return `${left}/${right}`;
			case "+":
				return `${left}+${right}`;
			case "-":
				return `${left}-${right}`;
			case "^":
				return `${left}^${right}`;
		}
	}
	throw new Error("Node Type not supported");
}
