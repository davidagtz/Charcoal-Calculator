import React, { CSSProperties } from 'react';
import ErrorFreeParser from '../../Tools/brains/ErrorFreeParser';
import { charFormat } from './EquationComponents/Formatter';
// import Parser, { isFunction } from '../../Tools/brains/Parser';
// import { toTex } from '../../Tools/brains/Calculator';
require('./FakeInput.sass');

export default class FakeInput extends React.Component<{
    style: CSSProperties;
    id: string;
}> {
    interval = null as null | NodeJS.Timeout;
    state = {
        isFocused: false,
        text: ''
    };
    render() {
        const cursor = <div id="cursor" />;
        const parser = new ErrorFreeParser(this.state.text);
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
                    onBlur={this.blur}
                    // onKeyUp={this.putCursor}
                />
                <span id={this.props.id + '-span'}>{charFormat(parser.parseAll(), 'fo-1')}</span>
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
                // const eq = document.getElementById(
                // 	"fo-1"
                // ) as HTMLDivElement;
                // const text = document.getElementById(
                // 	this.props.id + "-text"
                // ) as HTMLTextAreaElement;
                // const last = this.getDeepLast(eq);
                // console.log(last);
                if (cursor.className === '') {
                    cursor.className = 'active';
                } else {
                    cursor.className = '';
                }
                // last.appendChild(cursor);
            }, 500);
        }
    }

    putCursor = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        const eq = document.getElementById('fo-1') as HTMLDivElement;
        if (!eq.children || eq.children.length === 0) return;

        const cursor = document.getElementById('cursor');
        if (!cursor) {
            console.log('WTF');
            return;
        }

        const text = document.getElementById(this.props.id + '-text') as HTMLTextAreaElement;

        const find = text.selectionStart;
        console.log('find: ', find);
        console.log(eq.children);

        let pointer = eq.children[0];
        let index = 0;
        if (pointer.className === 'value') {
            if (pointer.innerHTML.length + index >= find) {
                const inner = pointer.innerHTML;
                pointer.innerHTML = inner.substring(0, find - index);
                // pointer.appendChild(cursor);
                // cursor.remove();
                pointer.innerHTML += inner.substring(find - index);
                console.log(pointer);
            } else {
                index += pointer.innerHTML.length;
            }
        }
    };

    getDeepLast(el: HTMLElement) {
        let last = el as Element;
        while (this.last(last)) last = this.last(last);
        return last;
    }
    last(el: Element) {
        return el.children[el.children.length - 1];
    }
    blur = () => {
        this.setState({
            isFocused: false
        });
    };
    focus = () => {
        const input = document.getElementById(this.props.id + '-text') as HTMLTextAreaElement;
        setTimeout(() => {
            input.focus();
            this.setState({
                isFocused: true
            });
        }, 0);
    };
    componentWillUnmount() {
        // if (this.interval) clearInterval(this.interval);
        // this.blur = () => {};
        // const text = document.getElementById(this.props.id + "-text");
        // if (text) {
        // 	text.onblur = null;
        // 	text.onchange = null;
        // }
    }
    format = () => {
        // const parser = new ErrorFreeParser(this.state.text);
        // const span = document.getElementById(
        // 	this.props.id + "-span"
        // ) as HTMLSpanElement;
        // span.innerHTML = charFormat(parser.parseAll());
        //    try {
        //        const tree = parser.parse();
        //        let tex = toTex(tree);
        //        let result = 0;
        //        const span = document.getElementById(this.props.id + '-span') as HTMLSpanElement;
        //        span.innerHTML = tex;
        //   const errors = this.state.error;
        //   errors[rowNumber] = false;
        //   const results = this.state.value;
        //   results[rowNumber] = result;
        //   this.setState({ error: errors, value: results, html: tex });
        //    } catch (e) {
        //   const errors = this.state.error;
        //   if (i.value.trim() !== '') errors[rowNumber] = true;
        //   else errors[rowNumber] = false;
        //   const results = this.state.value;
        //   results[rowNumber] = 0;
        //   this.setState({ error: errors, result: results, html: '' });
        //   this.props.changeExpression(rowNumber, null);
        //   console.error(e);
        //    }
    };
}
