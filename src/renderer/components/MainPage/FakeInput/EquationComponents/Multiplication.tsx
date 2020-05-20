import React from 'react';
import { EquationProps } from './Formatter';

export default function Multiplication(props: EquationProps) {
    return (
        <div className="format-multiplication">
            {props.first}
            <div className="sign">*</div>
            {props.second}
        </div>
    );
}
