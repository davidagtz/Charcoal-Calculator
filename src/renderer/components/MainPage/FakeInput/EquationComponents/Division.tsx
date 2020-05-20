import React from 'react';
import { EquationProps } from './Formatter';

export default function Division(props: EquationProps) {
    return (
        <div className="format-division">
            {props.first}
            <div className="sign"></div>
            {props.second}
        </div>
    );
}
