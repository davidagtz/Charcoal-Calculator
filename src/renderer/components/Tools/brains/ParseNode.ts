import { ParseNode, TYPE, VarFunction } from './Types';
import { calculate } from './Calculator';

export function isFunction(tree: ParseNode | null): boolean {
    if (!tree) return false;
    if (tree.type === TYPE.VARIABLE) return true;
    return isFunction(tree.left) || isFunction(tree.right);
}

export function toFunction(tree: ParseNode | null): VarFunction | null {
    return _toFunction(simplify(tree));
}

export function makeParseNode(
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

function _toFunction(tree: ParseNode | null): VarFunction | null {
    if (!tree) return null;
    if (tree.type === TYPE.NUMBER) return makeVarFunction([], tree);
    if (tree.type === TYPE.VARIABLE) return makeVarFunction([tree.value as string], tree);
    if (tree.type === TYPE.OPERATION) return makeVarFunction(getArguments(tree), tree);
    throw new Error('Invalid Type when trying to functionize');
}

function makeVarFunction(args: string[], root: ParseNode): VarFunction {
    return {
        root,
        arguments: args
    };
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

function getArguments(tree: ParseNode | null): string[] {
    if (tree === null) return [];
    if (tree.type === TYPE.VARIABLE) return [tree.value as string];
    if (tree.type === TYPE.OPERATION) {
        const args = getArguments(tree.left);
        const args_right = getArguments(tree.right);

        for (let i = 0; i < args_right.length; i += 1) {
            if (args.indexOf(args_right[i]) === -1) args.push(args_right[i]);
        }

        return args;
    }
    if (tree.type === TYPE.NUMBER) return [];
    throw new Error('Type not supported while getting arguments: ' + tree.value);
}
