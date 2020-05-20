import React from 'react';
import { EquationProps } from './Formatter';

export default function Addition(props: EquationProps) {
    return (
        <div className="format-addition">
            {props.first}
            <div className="sign">+</div>
            {props.second}
        </div>
    );
}
