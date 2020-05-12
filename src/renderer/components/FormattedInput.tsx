import React, { Component } from 'react';
import Parser, { isFunction, toFunction } from './brains/Parser';
import calculate, { toTex } from './brains/Calculator';
import { loadMathJax } from '../mathjax-electron/index';
import { ExpressionProps } from './brains/Types';
require('../styles/FormattedInput.sass');

export default class FormattedInput extends Component<ExpressionProps> {
    state = {
        html: '$$E = c^{\\frac {3}{5}}$$',
        error: [] as boolean[],
        value: [] as number[],
        MathJax: false,
        rows: 0
    };
    changeFocus = -1;
    constructor(props: any) {
        super(props);
        loadMathJax(document, () => {
            this.state.MathJax = true;
        });
        this.inputChange = this.inputChange.bind(this);
        this.addRow = this.addRow.bind(this);
        this.state.rows++;
    }

    inputChange(rowNumber: number) {
        return () => {
            const i: HTMLInputElement = document.getElementById(
                'finput-' + rowNumber
            ) as HTMLInputElement;

            let parser = new Parser(i.value);

            try {
                let tree = parser.parse();
                let tex = '';
                let result = 0;
                if (isFunction(tree)) {
                    if (this.props.expressions.length === this.state.rows)
                        this.props.changeExpression(rowNumber, toFunction(tree)!);
                    else this.props.addExpression(toFunction(tree)!);
                    if (tree) tex = toTex(tree);
                } else if (tree) {
                    result = calculate(tree);
                    tex = toTex(tree);
                }
                let errors = this.state.error;
                errors[rowNumber] = false;
                let results = this.state.value;
                results[rowNumber] = result;
                this.setState({ error: errors, value: results, html: tex });
            } catch (e) {
                let errors = this.state.error;
                errors[rowNumber] = true;
                let results = this.state.value;
                results[rowNumber] = 0;
                this.setState({ error: errors, result: results, html: '' });
                console.error(e);
            }
        };
    }

    componentDidUpdate() {
        if (this.state.MathJax)
            MathJax.Hub.Queue(['Typeset', MathJax.Hub, document.getElementById('to-format')]);

        if (this.changeFocus !== -1) {
            document.getElementById('finput-' + this.changeFocus)?.focus();
            this.changeFocus = -1;
        }
    }
    addRow(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.charCode === 13) {
            this.changeFocus = this.state.rows;
            this.setState({ rows: this.state.rows + 1 });
        }
    }
    render() {
        let rows = [] as React.ReactNode[];
        for (let i = 0; i < this.state.rows; i++) {
            rows.push(this.makeInput(i));
        }
        return (
            <div className="formatted-input">
                {rows}
                <p id="to-format">{this.state.html}</p>
            </div>
        );
    }

    makeInput(key: number) {
        return (
            <div key={key}>
                <input
                    id={'finput-' + key}
                    className={this.state.error[key] ? ' error' : ''}
                    onChange={this.inputChange(key)}
                    onKeyPress={this.addRow}
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
