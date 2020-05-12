import { TYPE, Token, ParseNode, InvalidCharacterError, VarFunction } from './Types';
import tokenize from './Tokenizer';
import calculate from './Calculator';

export default class Parser {
    tokens: Token[];
    pos: number;

    constructor(input: string) {
        this.tokens = tokenize(input);
        this.pos = 0;
    }

    parseRightOp(left: ParseNode, prec: number): ParseNode | null {
        while (true) {
            let op = this.now();
            if (!op) return left;

            if (op.type === TYPE.PARENTHESES && op.value === ')') return left;
            if (op.type !== TYPE.OPERATION) throw InvalidCharacterError(op.value);

            const cur = this.getPrecedence(op);
            let val: any = op.value;

            if (cur < prec) return left;
            this.pos++;

            let right = this.parsePrimary();
            if (!right) throw new Error('Expected Expression');

            // if (this.pos >= this.tokens.length)
            // 	return makeParseNode(
            // 		val.op,
            // 		TYPE.OPERATION,
            // 		left,
            // 		right
            // 	);
            if (cur < this.getPrecedence(this.now())) {
                right = this.parseRightOp(right, cur + 1);
                if (!right) throw new Error('Expected Expression');
            }
            left = makeParseNode(val.op, TYPE.OPERATION, left, right);
        }
    }

    parse(): ParseNode | null {
        let left = this.parsePrimary();
        if (!left) return null;
        return this.parseRightOp(left, 0);
    }

    parseParenExpr(): ParseNode | null {
        if (this.now().value !== '(') throw InvalidCharacterError(this.now().value);
        this.pos++;
        let expr = this.parse();
        if (this.now().type !== TYPE.PARENTHESES || this.now().value !== ')')
            throw InvalidCharacterError(this.now().value);
        this.pos++;
        return expr;
    }

    parsePrimary(): ParseNode | null {
        switch (this.now().type) {
            case TYPE.NUMBER:
                let num: any = this.now().value;
                this.pos++;
                return makeParseNode(num, TYPE.NUMBER);
            case TYPE.OPERATION:
                throw new Error('Primary Expression cannot start with operation');
            case TYPE.VARIABLE:
                let variable: any = this.now().value;
                this.pos++;
                return makeParseNode(variable, TYPE.VARIABLE);
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

function makeParseNode(
    value: string | number,
    type: TYPE,
    left: ParseNode | null = null,
    right: ParseNode | null = null
) {
    return {
        value,
        type,
        left,
        right
    };
}
export function isFunction(tree: ParseNode | null): boolean {
    if (!tree) return false;
    if (tree.type === TYPE.VARIABLE) return true;
    return isFunction(tree.left) || isFunction(tree.right);
}

export function toFunction(tree: ParseNode | null): VarFunction | null {
    return _toFunction(simplify(tree));
}

function _toFunction(tree: ParseNode | null): VarFunction | null {
    if (!tree) return null;
    if (tree.type === TYPE.NUMBER) return makeVarFunction([], tree);
    if (tree.type === TYPE.VARIABLE) return makeVarFunction([tree.value as string], tree);
    if (tree.type === TYPE.OPERATION) return makeVarFunction(getArguments(tree), tree);
    throw new Error('Invalid Type when trying to functionize');
}

function getArguments(tree: ParseNode | null): string[] {
    if (tree === null) return [];
    if (tree.type === TYPE.VARIABLE) return [tree.value as string];
    if (tree.type === TYPE.OPERATION) {
        let args = getArguments(tree.left);
        let args_right = getArguments(tree.right);

        for (let i = 0; i < args_right.length; i++)
            if (args.indexOf(args_right[i]) === -1) args.push(args_right[i]);

        return args;
    }
    if (tree.type === TYPE.NUMBER) return [];
    throw new Error('Type not supported while getting arguments: ' + tree.value);
}

function simplify(tree: ParseNode | null): ParseNode | null {
    if (!tree) return null;
    switch (tree.type) {
        case TYPE.NUMBER:
            return tree;
        case TYPE.VARIABLE:
            return tree;
        case TYPE.OPERATION:
            tree.left = simplify(tree.left);
            tree.right = simplify(tree.right);
            if (isFunction(tree.left) || isFunction(tree.right)) return tree;
            return makeParseNode(calculate(tree), TYPE.NUMBER);
    }
    throw new Error('Invalid Type when trying to simplify');
}

function makeVarFunction(args: string[], root: ParseNode): VarFunction {
    return {
        root,
        arguments: args
    };
}
