import React, { Component, CSSProperties } from 'react';
require('../../styles/Buttons.sass');
import PlusMinus from '../res/PlusMinus';
import { StyleSchema } from '../Tools/brains/Types';
import HoverButton from '../Tools/HoverButton';

export default class Buttons extends Component<{
    style: StyleSchema;
}> {
    state = {
        active: null as null | string
    };
    render() {
        return (
            <div
                id="buttons"
                style={{
                    backgroundColor: this.props.style.Calculator.background
                }}
            >
                <table>
                    <tbody>
                        <tr>
                            {this.createButton(1)}
                            {this.createButton(2)}
                            {this.createButton(3)}
                        </tr>
                        <tr>
                            {this.createButton(4)}
                            {this.createButton(5)}
                            {this.createButton(6)}
                        </tr>
                        <tr>
                            {this.createButton(7)}
                            {this.createButton(8)}
                            {this.createButton(9)}
                        </tr>
                        <tr>
                            <td
                                style={{
                                    backgroundColor: this.props.style.defaultButtons.color,
                                    color: this.props.style.defaultButtons.font
                                }}
                            >
                                {PlusMinus}
                            </td>
                            {this.createButton(0)}
                            <td
                                style={{
                                    backgroundColor: this.props.style.defaultButtons.color,
                                    color: this.props.style.defaultButtons.font
                                }}
                            >
                                <span className="vertical-center">.</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    createButton(val: any) {
        const props = {
            style: {
                backgroundColor: this.props.style.defaultButtons.color,
                color: this.props.style.defaultButtons.font,
                textAlign: 'center'
            } as CSSProperties,
            onhover: {
                backgroundColor: this.props.style.Calculator.buttons.hover
            },
            onactive: {
                backgroundColor: this.props.style.Calculator.buttons.active
            }
        };
        if (val == this.state.active)
            props.style.backgroundColor = props.onhover.backgroundColor =
                props.onactive.backgroundColor;
        return (
            <td id={'' + val}>
                <HoverButton {...props} className="td-fill">
                    {val}
                </HoverButton>
            </td>
        );
    }
    componentDidMount() {
        document.addEventListener('keydown', e => {
            if (this.state.active) return;
            const ch = e.key.charCodeAt(0);
            if (ch >= 48 && ch <= 57) {
                this.setState({
                    active: e.key
                });
            }
        });
        document.addEventListener('keyup', e => {
            const ch = e.key.charCodeAt(0);
            if (ch >= 48 && ch <= 57) {
                this.setState({
                    active: null
                });
            }
        });
    }
}
