import { TYPE, Token, ParseNode, InvalidCharacterError } from "./Types";
import tokenize from "./Tokenizer";

export default class Parser {
	tokens: Token[];
	pos: number;

	constructor(input: string) {
		this.tokens = tokenize(input);
		this.pos = 0;
	}

	makeParseNode(
		value: string | number,
		type: TYPE,
		left: ParseNode | null = null,
		right: ParseNode | null = null
	) {
		return {
			value,
			type,
			left,
			right,
		};
	}

	parseRightOp(left: ParseNode, prec: number): ParseNode | null {
		while (true) {
			let op = this.now();
			if (!op) return left;

			if (op.type === TYPE.PARENTHESES && op.value === ")")
				return left;
			if (op.type !== TYPE.OPERATION)
				throw InvalidCharacterError(op.value);

			const cur = this.getPrecedence(op);
			let val: any = op.value;

			if (cur < prec) return left;
			this.pos++;

			let right = this.parsePrimary();
			if (!right) throw new Error("Expected Expression");

			// if (this.pos >= this.tokens.length)
			// 	return this.makeParseNode(
			// 		val.op,
			// 		TYPE.OPERATION,
			// 		left,
			// 		right
			// 	);
			if (cur < this.getPrecedence(this.now())) {
				right = this.parseRightOp(right, cur + 1);
				if (!right) throw new Error("Expected Expression");
			}
			left = this.makeParseNode(val.op, TYPE.OPERATION, left, right);
		}
	}

	parse(): ParseNode | null {
		let left = this.parsePrimary();
		if (!left) return null;
		return this.parseRightOp(left, 0);
	}

	parseParenExpr(): ParseNode | null {
		if (this.now().value !== "(")
			throw InvalidCharacterError(this.now().value);
		this.pos++;
		let expr = this.parse();
		if (this.now().type !== TYPE.PARENTHESES || this.now().value !== ")")
			throw InvalidCharacterError(this.now().value);
		this.pos++;
		return expr;
	}

	parsePrimary(): ParseNode | null {
		switch (this.now().type) {
			case TYPE.NUMBER:
				let num: any = this.now().value;
				this.pos++;
				return this.makeParseNode(num, TYPE.NUMBER);
			case TYPE.OPERATION:
				throw new Error(
					"Primary Expression cannot start with operation"
				);
			case TYPE.VARIABLE:
				let variable: any = this.now().value;
				this.pos++;
				return this.makeParseNode(variable, TYPE.VARIABLE);
			case TYPE.PARENTHESES:
				return this.parseParenExpr();
		}
		return null;
	}

	getPrecedence(token: Token = this.now()) {
		if (!token || token.type !== TYPE.OPERATION) return -1;
		let val: any = token.value;
		return val.precedence;
	}

	now(): Token {
		return this.tokens[this.pos];
	}
}
