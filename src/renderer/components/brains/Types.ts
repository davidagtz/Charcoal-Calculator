export enum TYPE {
    NUMBER,
    OPERATION,
    VARIABLE,
    PARENTHESES
}

export interface Token {
    value: string | number | OP;
    type: TYPE;
}

export interface ParseNode {
    value: string | number;
    type: TYPE;
    left: ParseNode | null;
    right: ParseNode | null;
}

export interface OP {
    op: string;
    precedence: number;
}

export function InvalidCharacterError(char: any): Error {
    let err = new Error('Invalid Character: "' + char + '"');
    err.name = 'Invalid Character Error';
    return err;
}

export interface VarFunction {
    arguments: string[];
    root: ParseNode;
}

export interface ExpressionProps {
    expression: VarFunction;
    changeExpression: (exp: VarFunction) => void;
}
