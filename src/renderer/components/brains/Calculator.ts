import { ParseNode, TYPE, VarFunction } from './Types';

export default function calculate(tree: ParseNode): number {
    if (tree.type === TYPE.NUMBER) return tree.value as number;
    if (tree.type === TYPE.OPERATION) {
        let left = calculate(tree.left!);
        let right = calculate(tree.right!);
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
    return '$$' + texize(tree) + '$$';
}

function texize(tree: ParseNode): string {
    if (tree.type === TYPE.NUMBER) return '' + tree.value;
    if (tree.type === TYPE.OPERATION) {
        let left = texize(tree.left!);
        let right = texize(tree.right!);
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
    let t = replace(x, ParseNodeCopy(func.root));
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

function ParseNodeCopy(node: ParseNode | null): ParseNode | null {
    if (!node) return node;
    return {
        type: node.type,
        value: node.value,
        left: ParseNodeCopy(node.left),
        right: ParseNodeCopy(node.right)
    };
}
