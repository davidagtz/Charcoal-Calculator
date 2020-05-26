import React from 'react';
import { EquationProps } from './Formatter';

export default class Exponent extends React.Component<EquationProps> {
    render() {
        return (
            <div className="format-exponent">
                {this.props.first}
                <div className="raise">{this.props.second}</div>
            </div>
        );
    }
}
