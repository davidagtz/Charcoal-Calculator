import React, { Component } from 'react';
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
        error: [] as boolean[],
        value: [] as number[],
        rows: 1
    };
    changeFocus = -1;
    constructor(props: any) {
        super(props);
        this.inputChange = this.inputChange.bind(this);
        this.addRow = this.addRow.bind(this);
    }

    inputChange(rowNumber: number) {
        return () => {
            console.log('D');
            const i = document.getElementById(`finput-${rowNumber}-text`) as HTMLTextAreaElement;

            try {
                const tree = new Parser(i.value).parse();
                let tex = '';
                let result = 0;
                if (tree) {
                    if (isFunction(tree)) {
                        if (this.props.expressions.length > rowNumber) {
                            this.props.changeExpression(rowNumber, toFunction(tree)!);
                        } else {
                            this.props.addExpression(toFunction(tree)!);
                        }
                    } else {
                        result = calculate(tree);
                    }

                    tex = toTex(tree);
                }

                const errors = this.state.error;
                errors[rowNumber] = false;

                const results = this.state.value;
                results[rowNumber] = result;

                this.setState({ error: errors, value: results, html: tex });
            } catch (e) {
                const errors = this.state.error;

                if (i.value.trim() !== '') {
                    errors[rowNumber] = true;
                } else {
                    errors[rowNumber] = false;
                }

                const results = this.state.value;
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
    addRow(e: React.KeyboardEvent<Element>) {
        if (e.key === 'Enter') {
            this.changeFocus = this.state.rows;
            this.props.addExpression(null);
            this.setState({ rows: this.state.rows + 1 });
        }
    }
    render() {
        const rows = [] as React.ReactNode[];
        for (let i = 0; i < this.state.rows; i += 1) {
            rows.push(this.makeInput(i));
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
                    onKeyPress={this.addRow}
                    className={this.state.error[key] ? ' error' : ''}
                    onChange={this.inputChange(key)}
                />
                <div className={'ans' + (this.state.error[key] ? ' error' : '')}>
                    {this.state.error[key] || !this.state.value[key]
                        ? ''
                        : '=\u00A0' + this.state.value[key]}
                </div>
            </div>
        );
    }
}
