import { OP, TYPE } from './Types';

export function isalpha(char: string) {
    if (char.length !== 1) throw new Error('Illegal Argument');
    const val = char.charCodeAt(0);
    if ((val >= 65 && val <= 92) || (val >= 97 && val <= 122)) return true;
    return false;
}

export function isnum(char: string) {
    if (char.length !== 1) throw new Error('Illegal Argument');
    const val = char.charCodeAt(0);
    if (val >= 48 && val <= 57) return true;
    return false;
}

export function iswhitespace(char: string) {
    if (char.length !== 1) throw new Error('Illegal Argument');
    return char === ' ';
}

export function makeToken(input: string | number | OP, type: TYPE, asString?: string) {
    return {
        type,
        asString,
        value: input
    };
}

export function makeOP(op: string, prec: number): OP {
    return {
        op,
        precedence: prec
    };
}

export function isop(input: string, from: number, OPERATORS: OP[]): boolean {
    for (let i = 0; i < OPERATORS.length; i += 1) {
        const op = OPERATORS[i].op;
        if (input.substring(from, from + op.length) === op) return true;
    }
    return false;
}

export function getop(input: string, from: number, OPERATORS: OP[]): OP | null {
    for (let i = 0; i < OPERATORS.length; i += 1) {
        const op = OPERATORS[i];
        if (input.substring(from, from + op.op.length) === op.op) return op;
    }
    return null;
}
