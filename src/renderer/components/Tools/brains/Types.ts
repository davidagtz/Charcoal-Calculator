export enum TYPE {
    NUMBER,
    OPERATION,
    VARIABLE,
    PARENTHESES,
    UNKNOWN
}

export interface Token {
    value: string | number | OP;
    type: TYPE;
    asString?: string;
}

export interface ParseNode {
    value: string | number;
    asString?: string;
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
    expressions: {
        [index: number]: VarFunction;
    };
    changeExpression: (i: number, exp: VarFunction | null) => void;
}

export interface StyleSchema {
    Graph: {
        background: string;
        axis: string;
        font: string;
        equationColors: string[];
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
            hover: string;
            active: string;
        };
    };
    TitleBar: {
        font: string;
        background: string;
        buttons: {
            submenuhover: string;
        };
    };
    defaultButtons: {
        font: string;
        color: string;
        hover: string;
        active: string;
    };
}
