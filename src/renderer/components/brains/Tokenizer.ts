import { OP, Token, TYPE, InvalidCharacterError } from './Types';

export const OPERATORS: OP[] = [
    makeOP('^', 19),
    makeOP('*', 15),
    makeOP('/', 15),
    makeOP('+', 10),
    makeOP('-', 10)
];

export default function tokenize(input: string): Token[] {
    let i = 0;
    const tokens: Token[] = [];
    while (i < input.length) {
        if (isalpha(input[i])) {
            tokens.push(makeToken(input[i], TYPE.VARIABLE));
            i += 1;
        } else if (isnum(input[i])) {
            // (input[i] === "-" && isnum(input[i + 1]) && i + 1 < input.length)
            let str = '';
            do {
                str += input[i];
                i += 1;
            } while (i < input.length && isnum(input[i]));
            tokens.push(makeToken(parseInt(str, 10), TYPE.NUMBER));
        } else if (isop(input, i)) {
            const op = getop(input, i);
            i += op!.op.length;
            tokens.push(makeToken(op!, TYPE.OPERATION));
        } else if (input[i] === '(' || input[i] === ')') {
            tokens.push(makeToken(input[i], TYPE.PARENTHESES));
            i += 1;
        } else if (iswhitespace(input[i])) {
            i += 1;
        } else {
            throw InvalidCharacterError(input[i]);
        }
    }
    return tokens;
}

function isalpha(char: string) {
    if (char.length !== 1) throw new Error('Illegal Argument');
    const val = char.charCodeAt(0);
    if ((val >= 65 && val <= 92) || (val >= 97 && val <= 122)) return true;
    return false;
}

function isnum(char: string) {
    if (char.length !== 1) throw new Error('Illegal Argument');
    const val = char.charCodeAt(0);
    if (val >= 48 && val <= 57) return true;
    return false;
}

function iswhitespace(char: string) {
    if (char.length !== 1) throw new Error('Illegal Argument');
    return char === ' ';
}

function makeToken(input: string | number | OP, type: TYPE) {
    return {
        type,
        value: input
    };
}

function makeOP(op: string, prec: number): OP {
    return {
        op,
        precedence: prec
    };
}

function isop(input: string, from: number): boolean {
    for (let i = 0; i < OPERATORS.length; i += 1) {
        const op = OPERATORS[i].op;
        if (input.substring(from, from + op.length) === op) return true;
    }
    return false;
}

function getop(input: string, from: number): OP | null {
    for (let i = 0; i < OPERATORS.length; i += 1) {
        const op = OPERATORS[i];
        if (input.substring(from, from + op.op.length) === op.op) return op;
    }
    return null;
}
