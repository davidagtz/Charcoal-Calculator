import React, { Component } from 'react';
import Parser, { isFunction, toFunction } from './brains/Parser';
import calculate, { toTex } from './brains/Calculator';
import { loadMathJax } from '../mathjax-electron/index';
import { ExpressionProps } from './brains/Types';
require('../styles/FormattedInput.sass');

export default class FormattedInput extends Component<ExpressionProps> {
    state = {
        html: '$$E = c^{\\frac {3}{5}}$$',
        error: null,
        value: null,
        MathJax: false
    };
    constructor(props: any) {
        super(props);
        loadMathJax(document, () => {
            this.state.MathJax = true;
        });
        this.inputChange = this.inputChange.bind(this);
    }

    inputChange() {
        const i: any = document.getElementById('finput');
        let parser = new Parser(i!.value);
        try {
            let tree = parser.parse();
            let tex = '';
            let result = 0;
            if (isFunction(tree)) {
                this.props.changeExpression(toFunction(tree)!);
                if (tree) tex = toTex(tree);
            } else if (tree) {
                result = calculate(tree);
                tex = toTex(tree);
            }
            this.setState({ error: null, value: result, html: tex });
        } catch (e) {
            this.setState({ error: e.message, result: null, html: '' });
            console.error(e);
        }
    }

    componentDidUpdate() {
        if (this.state.MathJax)
            MathJax.Hub.Queue(['Typeset', MathJax.Hub, document.getElementById('to-format')]);
    }
    render() {
        const inp = (
            <input
                id="finput"
                className={this.state.error ? ' error' : ''}
                onChange={this.inputChange}
            />
        );

        return (
            <div className="formatted-input">
                <div>
                    {inp}
                    <div className={'ans' + (this.state.error ? ' error' : '')}>
                        {this.state.error || !this.state.value ? '' : '=\u00A0' + this.state.value}
                    </div>
                </div>
                <p id="to-format">{this.state.html}</p>
            </div>
        );
    }
}
