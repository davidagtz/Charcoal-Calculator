import { TYPE, OP, Token, ParseNode, InvalidCharacterError } from "./Types";
import tokenize from "./Tokenizer";
import { makeParseNode } from "./ParseNode";

export default class Parser {
	tokens: Token[];
	pos: number;

	constructor(input: string | Token[]) {
		if (typeof input === "string") this.tokens = tokenize(input);
		else this.tokens = input;
		this.pos = 0;
	}

	parseRightOp(left: ParseNode, prec: number): ParseNode | null {
		let newLeft = left;
		while (true) {
			const op = this.now();
			if (!op) return newLeft;

			if (op.type === TYPE.PARENTHESES && op.value === ")")
				return newLeft;
			if (op.type !== TYPE.OPERATION)
				throw InvalidCharacterError(op.value);

			const cur = this.getPrecedence(op);
			const val: any = op.value;

			if (cur < prec) return newLeft;
			this.pos += 1;

			let right = this.parsePrimary();
			if (!right) throw new Error("Expected Expression");

			if (cur < this.getPrecedence(this.now())) {
				right = this.parseRightOp(right, cur + 1);
				if (!right) throw new Error("Expected Expression");
			}
			newLeft = makeParseNode(val.op, TYPE.OPERATION, newLeft, right);
		}
	}

	parse(): ParseNode | null {
		const left = this.parsePrimary();
		if (!left) return null;
		return this.parseRightOp(left, 0);
	}

	parseParenExpr(): ParseNode | null {
		if (this.now().value !== "(")
			throw InvalidCharacterError(this.now().value);
		this.pos += 1;
		const expr = this.parse();
		if (
			this.now().type !== TYPE.PARENTHESES ||
			this.now().value !== ")"
		) {
			throw InvalidCharacterError(this.now().value);
		}
		this.pos += 1;
		return expr;
	}

	parsePrimary(): ParseNode | null {
		switch (this.now().type) {
			case TYPE.NUMBER:
				const num = this.now().value as number;
				this.pos += 1;
				return makeParseNode(num, TYPE.NUMBER);
			case TYPE.OPERATION:
				throw new Error(
					"Primary Expression cannot start with operation"
				);
			case TYPE.VARIABLE:
				const variable = this.now().value as string;
				this.pos += 1;
				return makeParseNode(variable, TYPE.VARIABLE);
			case TYPE.PARENTHESES:
				return this.parseParenExpr();
		}
		return null;
	}

	getPrecedence(token: Token = this.now()) {
		if (!token || token.type !== TYPE.OPERATION) return -1;
		const val = token.value as OP;
		return val.precedence;
	}

	now(): Token {
		return this.tokens[this.pos];
	}
}
