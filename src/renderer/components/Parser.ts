interface ParseNode {
    operation: string;
    left: ParseNode | null;
    right: ParseNode | null;
}

enum TYPE {
    NUMBER,
    OPERATION,
    VARIABLE
}

interface Token {
    value: string | number | OP;
    type: TYPE;
}

function isalpha(char: string) {
    if (char.length !== 1) throw new Error('Illegal Argument');
    let val = char.charCodeAt(0);
    if ((val >= 65 && val <= 92) || (val >= 97 && val <= 122)) return true;
    return false;
}
function isnum(char: string) {
    if (char.length !== 1) throw new Error('Illegal Argument');
    let val = char.charCodeAt(0);
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

interface OP {
    op: string;
    precedence: number;
}

function makeOP(op: string, prec: number): OP {
    return {
        op,
        precedence: prec
    };
}

const operators: OP[] = [
    makeOP('^', 1),
    makeOP('*', 5),
    makeOP('/', 5),
    makeOP('+', 10),
    makeOP('-', 10)
];

function isop(input: string, from: number): boolean {
    for (let i = 0; i < operators.length; i++) {
        const op = operators[i].op;
        if (input.substring(from, from + op.length) === op) return true;
    }
    return false;
}

function getop(input: string, from: number) {
    for (let i = 0; i < operators.length; i++) {
        const op = operators[i];
        if (input.substring(from, from + op.op.length) === op.op) return op;
    }
    return null;
}

function tokenize(input: string): Token[] {
    let i = 0;
    let tokens: Token[] = [];
    while (i < input.length) {
        if (isalpha(input[i])) {
            tokens.push(makeToken(input[i], TYPE.VARIABLE));
            i++;
        } else if (
            isnum(input[i]) ||
            (input[i] === '-' && isnum(input[i + 1]) && i + 1 < input.length)
        ) {
            let str = '';
            do {
                str += input[i];
                i++;
            } while (i < input.length && isnum(input[i]));
            tokens.push(makeToken(parseInt(str), TYPE.NUMBER));
        } else if (isop(input, i)) {
            let op = getop(input, i);
            i += op!.op.length;
            tokens.push(makeToken(op!, TYPE.OPERATION));
        } else if (iswhitespace(input[i])) {
            i++;
        } else {
            throw new Error('Invalid Character: "' + input[i] + '"');
        }
    }
    return tokens;
}

// function parse(input:string, prec: number = 0, i: number = 0) {
//      while(true) {
//           let
//      }
// }

export default tokenize;
