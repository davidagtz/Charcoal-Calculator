import { ParseNode, TYPE } from "./Types";

export default function toTex(tree: (ParseNode | null)[]): string {
	return `$$${tree.map(texize).join(" ")}$$`;
}

function texize(tree: ParseNode | null): string {
	if (!tree) return "";
	if (tree.type === TYPE.NUMBER) return "" + tree.value;
	if (tree.type === TYPE.OPERATION) {
		const left = texize(tree.left);
		const right = texize(tree.right);
		switch (tree.value) {
			case "*":
				return `${left}*${right}`;
			case "/":
				return `\\frac {${left}}{${right}}`;
			case "+":
				return `${left}+${right}`;
			case "-":
				return `${left}-${right}`;
			case "^":
				return `{${left}}^{${right}}`;
		}
	}
	if (tree.type === TYPE.VARIABLE) return tree.value as string;
	throw new Error("Node Type not supported");
}