import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Parser from '../Tools/brains/Parser';
import { calculate, toTex } from '../Tools/brains/Calculator';
import { ExpressionProps, StyleSchema } from '../Tools/brains/Types';
import FakeInput from './FakeInput/FakeInput';
import { isFunction, toFunction } from '../Tools/brains/ParseNode';
require('./styles/FormattedInput.sass');

interface Props extends ExpressionProps {
    style: StyleSchema;
}

export default class FormattedInput extends Component<Props> {
    state = {
        error: {} as {
            [index: number]: boolean;
        },
        values: {} as {
            [index: number]: number;
        },
        keys: [] as number[]
    };
    changeFocus = -1;
    lastRowKey = 0;
    constructor(props: any) {
        super(props);
        this.inputChange = this.inputChange.bind(this);
        this.changeRow = this.changeRow.bind(this);

        this.changeFocus = this.lastRowKey;
        this.state.keys.push(this.lastRowKey);
    }

    inputChange(rowNumber: number) {
        return () => {
            const i = document.getElementById(`finput-${rowNumber}-text`) as HTMLTextAreaElement;

            try {
                const tree = new Parser(i.value).parse();
                let tex = '';
                let result = 0;
                if (tree) {
                    if (isFunction(tree)) {
                        this.props.changeExpression(rowNumber, toFunction(tree)!);
                    } else {
                        result = calculate(tree);
                    }

                    tex = toTex(tree);
                }

                const errors = this.state.error;
                errors[rowNumber] = false;

                const results = this.state.values;
                results[rowNumber] = result;

                this.setState({ error: errors, value: results, html: tex });
            } catch (e) {
                const errors = this.state.error;

                if (i.value.trim() !== '') {
                    errors[rowNumber] = true;
                } else {
                    errors[rowNumber] = false;
                }

                const results = this.state.values;
                results[rowNumber] = 0;

                this.setState({ error: errors, result: results, html: '' });
                this.props.changeExpression(rowNumber, null);

                // console.error(e);
            }
        };
    }

    componentDidUpdate() {
        if (this.changeFocus !== -1) {
            setTimeout(() => {
                document.getElementById(`finput-${this.changeFocus}-text`)!.focus();
                this.changeFocus = -1;
            }, 0);
        }
    }
    changeRow(e: React.KeyboardEvent<Element>, prevState: string) {
        if (e.key === 'Enter') {
            this.lastRowKey++;
            this.changeFocus = this.lastRowKey;
            this.setState({ keys: this.state.keys.concat(this.lastRowKey) });
        } else if (e.key === 'Backspace') {
            const focused = document.activeElement! as HTMLTextAreaElement;

            if (prevState.length !== 0 || this.state.keys.length === 1) {
                return;
            }

            const key = parseInt(focused.getAttribute('data-key')!, 10);
            const i = this.state.keys.indexOf(key);

            this.changeFocus = i - 1;

            this.setState({
                keys: this.state.keys.slice(0, i).concat(this.state.keys.slice(i + 1))
            });
        }
    }
    render() {
        const rows = [] as React.ReactNode[];
        for (let i = 0; i < this.state.keys.length; i += 1) {
            rows.push(this.makeInput(this.state.keys[i]));
        }

        return (
            <div
                className="formatted-input"
                style={{
                    backgroundColor: this.props.style.Calculator.background,
                    color: this.props.style.Calculator.font
                }}
            >
                {rows}
            </div>
        );
    }

    makeInput(key: number) {
        return (
            <div key={key}>
                <FakeInput
                    id={'finput-' + key}
                    style={{
                        backgroundColor: this.props.style.Calculator.input.background,
                        color: this.props.style.Calculator.input.font
                    }}
                    data-key={key}
                    onKeyPress={this.changeRow}
                    className={this.state.error[key] ? ' error' : ''}
                    onChange={this.inputChange(key)}
                />
                <div className="ans-cont">
                    <div className={'ans' + (this.state.error[key] ? ' error' : '')}>
                        {this.state.error[key] || !this.state.values[key]
                            ? ''
                            : '=\u00A0' + this.state.values[key]}
                    </div>
                </div>
            </div>
        );
    }
}
