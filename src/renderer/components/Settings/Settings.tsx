import React, { Component } from 'react';
import { StyleSchema } from '../Tools/brains/Types';
import ThemePicker from './ThemePicker';
import HoverButton from '../Tools/HoverButton';
require('./Settings.sass');

export default class Settings extends Component<{
    style: StyleSchema;
    changeStyle: (style: StyleSchema) => void;
}> {
    goBack() {
        let goBackEvent = new Event('openPage') as any;
        goBackEvent.page = 0;
        document.dispatchEvent(goBackEvent);
    }
    render() {
        const style = this.props.style;
        const buttonProps = {
            style: {
                backgroundColor: style.defaultButtons.color,
                color: style.defaultButtons.font
            },
            onhover: {
                backgroundColor: style.defaultButtons.active
            },
            onactive: {
                backgroundColor: style.defaultButtons.hover
            }
        };
        return (
            <div id="settings-page" style={color(style.Calculator.background)}>
                <HoverButton id="back-button" {...buttonProps} onClick={this.goBack} />
                <div id="settings-content">
                    {/* <ul
                        id="settings-menu"
                        style={{
                            borderRight: `1px ${style.Calculator.input.answerBackground} solid`
                        }}
                    >
                        <li>Themes</li>
                    </ul> */}
                    <ThemePicker style={style} changeStyle={this.props.changeStyle} />
                </div>
            </div>
        );
    }
}

function color(col: string) {
    return {
        backgroundColor: col
    };
}
