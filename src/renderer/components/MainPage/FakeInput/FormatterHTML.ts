import { ParseNode, TYPE } from '../../Tools/brains/Types';
require('./EquationComponents.sass');

export function charFormatHTML(tree: (ParseNode | null)[], id: string = ''): HTMLElement {
    const node = document.createElement('div');
    node.id = id;
    node.className = 'formatted-output';
    for (let i = 0; i < tree.length; i++) if (tree[i]) node.appendChild(_charFormatHTML(tree[i]!));

    return node;
}

function _charFormatHTML(tree: ParseNode): HTMLElement {
    const node = document.createElement('div');

    if (tree.type === TYPE.NUMBER || tree.type === TYPE.VARIABLE || tree.type === TYPE.UNKNOWN) {
        node.className = 'format-value';
        node.innerHTML = tree.value as string;
        return node;
    }
    if (tree.type === TYPE.OPERATION) {
        const sign = document.createElement('div');
        sign.className = 'sign';

        switch (tree.value) {
            case '*':
                node.className = 'format-multiplication';

                if (tree.left) node.appendChild(_charFormatHTML(tree.left));
                // sign.innerHTML = "*";
                node.appendChild(sign);
                if (tree.right) node.appendChild(_charFormatHTML(tree.right));

                return node;
            case '/':
                node.className = 'format-division';

                if (tree.left) node.appendChild(_charFormatHTML(tree.left));
                else node.appendChild(makeEmptyValue());
                node.appendChild(sign);
                if (tree.right) node.appendChild(_charFormatHTML(tree.right));
                else node.appendChild(makeEmptyValue());

                return node;
            case '+':
                node.className = 'format-addition';

                if (tree.left) node.appendChild(_charFormatHTML(tree.left));
                sign.innerHTML = '+';
                node.appendChild(sign);
                if (tree.right) node.appendChild(_charFormatHTML(tree.right));

                return node;
            case '-':
                node.className = 'format-subtraction';

                if (tree.left) node.appendChild(_charFormatHTML(tree.left));
                node.appendChild(sign);
                if (tree.right) node.appendChild(_charFormatHTML(tree.right));

                return node;
            case '^':
                node.className = 'format-exponent';
                if (tree.left) node.appendChild(_charFormatHTML(tree.left));
                else node.appendChild(makeEmptyValue());

                sign.className = 'raise';
                if (tree.right) sign.appendChild(_charFormatHTML(tree.right));
                node.appendChild(sign);

                return node;
        }
    }
    if (tree.type === TYPE.PARENTHESES) {
        node.className = 'format-parentheses';

        const signL = document.createElement('div');
        signL.className = 'sign';
        signL.innerHTML = '(';

        if (tree.value === '(') {
            node.appendChild(signL);
            if (tree.left) node.appendChild(_charFormatHTML(tree.left));
            return node;
        } else {
            node.appendChild(signL);
            if (tree.left) node.appendChild(_charFormatHTML(tree.left));

            const signR = document.createElement('div');
            signR.className = 'sign';
            signR.innerHTML = ')';
            node.appendChild(signR);

            return node;
        }
    }
    throw new Error('Node Type not supported');
}

function makeEmptyValue() {
    const el = document.createElement('div');
    el.className = 'format-value';
    return el;
}
