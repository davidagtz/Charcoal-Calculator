import { OP, Token, TYPE, InvalidCharacterError } from './Types';
import { makeOP, isalpha, makeToken, isnum, isop, getop, iswhitespace } from './JSChar';

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
        } else if (isop(input, i, OPERATORS)) {
            const op = getop(input, i, OPERATORS);
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
