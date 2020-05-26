import React from 'react';
import { EquationProps } from './Formatter';

export default function Subtraction(props: EquationProps) {
    return (
        <div className="format-subtraction">
            {props.first}
            <div className="sign"></div>
            {props.second}
        </div>
    );
}
