import { TYPE, OP, Token, ParseNode, InvalidCharacterError } from './Types';
import { makeParseNode } from './ParseNode';
import errorFreeTokenizer from './errorFreeTokenizer';

export default class ErrorFreeParser {
    tokens: Token[];
    pos: number;
    exprs: (ParseNode | null)[] = [];

    constructor(input: string | Token[]) {
        if (typeof input === 'string') this.tokens = errorFreeTokenizer(input);
        else this.tokens = input;
        this.pos = 0;
    }

    parseRightOp(left: ParseNode | null, prec: number): ParseNode | null {
        let newLeft = left;
        while (true) {
            const op = this.now();
            if (!op) return newLeft;

            if (op.type === TYPE.PARENTHESES && op.value === ')') return newLeft;
            if (op.type !== TYPE.OPERATION) {
                return newLeft;
            }

            const cur = this.getPrecedence(op);
            const val = op.value as OP;

            if (cur < prec) return newLeft;
            this.pos += 1;

            let right = this.parsePrimary();
            if (!right) {
                return makeParseNode(val.op, TYPE.OPERATION, newLeft, null);
            }

            if (cur < this.getPrecedence(this.now())) {
                right = this.parseRightOp(right, cur + 1);
                if (!right) {
                    return makeParseNode(val.op, TYPE.OPERATION, newLeft, null);
                }
            }
            newLeft = makeParseNode(val.op, TYPE.OPERATION, newLeft, right);
        }
    }

    parseAll() {
        while (this.pos < this.tokens.length) {
            this.exprs.push(this.parse());
        }
        return this.exprs;
    }

    parse(): ParseNode | null {
        let left = this.parsePrimary();
        if (left && left.type === TYPE.UNKNOWN) {
            this.exprs.push(left);
            left = this.parsePrimary();
        }
        return this.parseRightOp(left, 0);
    }

    parseParenExpr(): ParseNode | null {
        if (this.now().value !== '(') throw InvalidCharacterError(this.now().value);
        this.pos += 1;
        const expr = this.parse();
        if (
            !expr ||
            !this.now() ||
            this.now().type !== TYPE.PARENTHESES ||
            this.now().value !== ')'
        ) {
            return makeParseNode('(', TYPE.PARENTHESES, expr, null);
        }
        this.pos += 1;
        return makeParseNode('()', TYPE.PARENTHESES, expr, null);
    }

    parsePrimary(): ParseNode | null {
        if (!this.now()) return null;
        switch (this.now().type) {
            case TYPE.NUMBER:
                const num = this.now().value as number;
                const str = this.now().asString!;
                this.pos += 1;
                return makeParseNode(num, TYPE.NUMBER, null, null, str);
            case TYPE.OPERATION:
                return this.parseRightOp(null, 0);
            case TYPE.VARIABLE:
                const variable = this.now().value as string;
                this.pos += 1;
                return makeParseNode(variable, TYPE.VARIABLE);
            case TYPE.PARENTHESES:
                if (this.now().value === ')') {
                    this.pos += 1;
                    return makeParseNode(')', TYPE.PARENTHESES, null, null);
                }
                return this.parseParenExpr();
            case TYPE.UNKNOWN:
                const u = this.now().value as string;
                this.pos += 1;
                return makeParseNode(u, TYPE.UNKNOWN);
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
