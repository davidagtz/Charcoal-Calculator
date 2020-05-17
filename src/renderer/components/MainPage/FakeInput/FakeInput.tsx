import React, { CSSProperties } from 'react';
require('../../../styles/FakeInput.sass');

export default class FakeInput extends React.Component<{ style: CSSProperties; id: string }> {
    interval = null as null | NodeJS.Timeout;
    state = {
        isFocused: false,
        text: ''
    };
    render() {
        const cursor = <div id="cursor" />;
        return (
            <div
                id={this.props.id}
                className="fake-input"
                style={this.props.style}
                onMouseDown={this.focus}
            >
                <textarea
                    id={this.props.id + '-text'}
                    className="hide-text"
                    onChange={this.changeText}
                />
                <span id={this.props.id + '-span'}>{this.state.text}</span>
                {this.state.isFocused ? cursor : null}
            </div>
        );
    }
    componentDidMount = this.componentDidUpdate;

    changeText = () => {
        const text = document.getElementById(this.props.id + '-text') as HTMLTextAreaElement;
        this.setState({
            text: text.value
        });
    };
    componentDidUpdate() {
        if (this.interval) clearInterval(this.interval);
        const cursor = document.getElementById('cursor') as HTMLDivElement;
        if (cursor) {
            this.interval = setInterval(() => {
                if (!cursor) clearInterval(this.interval!);
                if (cursor.className === '') cursor.className = 'active';
                else cursor.className = '';
            }, 500);
        }
    }
    focus = (e: any) => {
        const input = document.getElementById(this.props.id + '-text') as HTMLTextAreaElement;
        setTimeout(() => {
            input.focus();
            this.setState({
                isFocused: true
            });
        }, 0);
    };
    constructor(props: any) {
        super(props);
    }
    format = () => {};
}
