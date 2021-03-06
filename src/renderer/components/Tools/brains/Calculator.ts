import { ParseNode, TYPE, VarFunction } from './Types';

export function calculate(tree: ParseNode): number {
    if (tree.type === TYPE.NUMBER) return tree.value as number;
    if (tree.type === TYPE.OPERATION) {
        const left = calculate(tree.left!);
        const right = calculate(tree.right!);
        switch (tree.value) {
            case '*':
                return left * right;
            case '/':
                return left / right;
            case '+':
                return left + right;
            case '-':
                return left - right;
            case '^':
                return Math.pow(left, right);
        }
    }
    throw new Error('Node Type not supported');
}

export function toTex(tree: ParseNode): string {
    return `$$${texize(tree)}$$`;
}

function texize(tree: ParseNode): string {
    if (tree.type === TYPE.NUMBER) return '' + tree.value;
    if (tree.type === TYPE.OPERATION) {
        const left = texize(tree.left!);
        const right = texize(tree.right!);
        switch (tree.value) {
            case '*':
                return `${left}*${right}`;
            case '/':
                return `\\frac {${left}}{${right}}`;
            case '+':
                return `${left}+${right}`;
            case '-':
                return `${left}-${right}`;
            case '^':
                return `{${left}}^{${right}}`;
        }
    }
    if (tree.type === TYPE.VARIABLE) return tree.value as string;
    throw new Error('Node Type not supported');
}

export function solve(x: number, func: VarFunction): number {
    const t = replace(x, parseNodeCopy(func.root));
    return calculate(t!);
}

function replace(x: number, tree: ParseNode | null): ParseNode | null {
    if (!tree) return null;
    if (tree.type === TYPE.NUMBER) return tree;
    if (tree.type === TYPE.VARIABLE) {
        tree.type = TYPE.NUMBER;
        tree.value = x;
        return tree;
    }
    if (tree.type === TYPE.OPERATION) {
        tree.left = replace(x, tree.left);
        tree.right = replace(x, tree.right);
        return tree;
    }
    throw new Error('Unsupported Type: ' + tree.value);
}

function parseNodeCopy(node: ParseNode | null): ParseNode | null {
    if (!node) return node;
    return {
        type: node.type,
        value: node.value,
        left: parseNodeCopy(node.left),
        right: parseNodeCopy(node.right)
    };
}
