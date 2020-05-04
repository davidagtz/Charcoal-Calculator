import React, { Component } from 'react';
const { loadAndTypeset } = require('mathjax-electron');
require('../styles/FormattedInput.sass');

export default class FormattedInput extends Component {
    state = {
        html: '$$E = c^{\\frac {3}{5}}$$'
    };
    str(num: number) {
        return `$$E = c^{\\frac {3}{${num}}}$$`;
    }
    constructor(props: any) {
        super(props);
        loadAndTypeset(document);
    }
    inputChange() {
        const i: any = document.getElementById('f');
        this.setState({
            html: this.str(parseInt(i!.value))
        });
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, document.getElementById('to-format')]);
    }
    render() {
        const inp = <input id="f" onChange={this.inputChange} />;

        return (
            <div className="formatted-input">
                {inp}
                <p id="to-format">{this.state.html}</p>
            </div>
        );
    }
}
