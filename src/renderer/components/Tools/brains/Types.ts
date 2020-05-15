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
    const err = new Error(`Invalid Character: "${char}"`);
    err.name = 'Invalid Character Error';
    return err;
}

export interface VarFunction {
    arguments: string[];
    root: ParseNode;
}

export interface ExpressionProps {
    expressions: (VarFunction | null)[];
    changeExpression: (i: number, exp: VarFunction | null) => void;
    addExpression: (exp: VarFunction | null) => void;
}

export interface StyleSchema {
    Graph: {
        background: string;
        axis: string;
        font: string;
        equation: string[];
    };
    Calculator: {
        input: {
            font: string;
            answerFont: string;
            answerBackground: string;
            background: string;
        };
        background: string;
        font: string;
        buttons: {
            color: string;
            font: string;
        };
    };
    TitleBar: {
        font: string;
        background: string;
        buttons: {
            hover: string;
            active: string;
            submenuhover: string;
        };
    };
}
