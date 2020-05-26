import React from 'react';

export default function Parentheses(props: { left: boolean; right: boolean; children: any }) {
    if (!props.children || (props.children as any).length) throw new Error('Invalid Props');
    return (
        <div className="format-parentheses">
            {props.left ? makeParen('(') : null}
            {props.children}
            {props.left ? makeParen(')') : null}
        </div>
    );
}

function makeParen(p: '(' | ')') {
    return <div className="sign">{p}</div>;
}
