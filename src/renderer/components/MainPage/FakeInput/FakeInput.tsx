import React, { CSSProperties } from 'react';
import ErrorFreeParser from '../../Tools/brains/ErrorFreeParser';
import { charFormatHTML } from './FormatterHTML';
require('./FakeInput.sass');
require('./EquationComponents.sass');

export default class FakeInput extends React.Component<{
    style: CSSProperties;
    id: string;
    onKeyPress?: (e: React.KeyboardEvent<Element>) => void;
    className?: string;
    onChange?: () => void;
}> {
    interval = null as null | NodeJS.Timeout;
    x = 0;

    constructor(props: any) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.changeText = this.changeText.bind(this);
        this.putCursor = this.putCursor.bind(this);
        this.textWidth = this.textWidth.bind(this);
        this.getTextArea = this.getTextArea.bind(this);
        this.blur = this.blur.bind(this);
        this.focus = this.focus.bind(this);
        this._put = this._put.bind(this);
    }

    render() {
        return (
            <div
                id={this.props.id}
                className={'fake-input ' + (this.props.className ? this.props.className : '')}
                style={this.props.style}
                onMouseDown={this.focus}
            >
                <textarea
                    id={this.props.id + '-text'}
                    className="hide-text"
                    onChange={this.changeText}
                    onBlur={this.blur}
                    onKeyUp={this.onKeyPress}
                    onFocus={this.focus}
                />
                <span id={this.props.id + '-span'}>
                    <div id={this.props.id + '-cursor'} className="cursor"></div>
                    <span id={this.props.id + '-replace'}>
                        <div id={this.props.id + '-fo'} />
                    </span>
                </span>
            </div>
        );
    }

    onChange() {
        this.changeText();
        if (this.props.onChange) this.props.onChange();
    }

    onKeyPress(e: React.KeyboardEvent<Element>) {
        this.putCursor();
        if (this.props.onKeyPress) {
            this.props.onKeyPress(e);
        }
    }

    changeText() {
        const text = document.getElementById(this.props.id + '-text') as HTMLTextAreaElement;

        const replace = document.getElementById(this.props.id + '-replace')!;
        replace.innerHTML = '';

        const parser = new ErrorFreeParser(text.value);
        replace.appendChild(charFormatHTML(parser.parseAll(), this.props.id + '-fo'));
    }

    cursor: HTMLDivElement | null = null;
    index = 0;
    find = 0;
    putCursor() {
        const eq = document.getElementById(this.props.id + '-fo') as HTMLDivElement;
        this.cursor = document.getElementById(this.props.id + '-cursor') as HTMLDivElement;

        this.find = this.getTextArea().selectionStart;
        this.index = 0;
        this.x = this.cursor.clientWidth;
        this.cursor.style.height = eq.style.fontSize + 'px';
        this.cursor.style.top = '0';

        if (this.find === 0 && eq.children.length === 0) {
            this.cursor.style.left = '0';
            return;
        }

        this._put(eq);
    }

    _put(this: any, el: Element): boolean {
        const cursor = this.cursor;
        const find = this.find;
        for (let i = 0; i < el.children.length; i++) {
            const child = el.children[i];
            const value = child.innerHTML;
            const innerI = find - this.index;

            if (child.className === 'format-value') {
                if (this.index <= find && find <= this.index + value.length) {
                    const nX = this.textWidth(
                        value.substring(0, innerI),
                        getComputedStyle(child).font
                    );
                    cursor.style.left = this.x + nX + 'px';

                    return true;
                }
                this.x += child.clientWidth;
                this.index += value.length;
            } else if (child.className === 'sign') {
                const nX = child.getBoundingClientRect().width;
                if (this.index <= find && find <= this.index + 1) {
                    cursor.style.left = this.x + nX + 'px';
                    return true;
                }
                this.x += nX;
                this.index++;
            } else if (child.className === 'raise') {
                if (this.index <= find && find <= this.index + 1) {
                    cursor.style.left = this.x + 'px';
                    cursor.style.height = child.clientHeight + 'px';
                    cursor.style.top = '-.75em';
                    return true;
                }
                this.index++;

                const top = cursor.style.top;
                const height = cursor.style.height;
                cursor.style.top = '-.75em';
                cursor.style.height = child.clientHeight + 'px';
                if (this._put(child)) return true;
                cursor.style.top = top;
                cursor.style.height = height;
            } else {
                if (this._put(child)) return true;
            }
        }
        return false;
    }

    fakeEl: HTMLElement | null = null;
    textWidth(str: string, font: string) {
        if (!this.fakeEl) {
            const fake = document.createElement('span');
            this.fakeEl = fake;
            document.body.append(this.fakeEl);
        }
        this.fakeEl.innerHTML = str;
        this.fakeEl.style.font = font;
        return this.fakeEl.offsetWidth;
    }

    getTextArea() {
        return document.getElementById(this.props.id + '-text') as HTMLTextAreaElement;
    }

    blur() {
        const cursor = document.getElementById(this.props.id + '-cursor') as HTMLElement;
        cursor.className = 'cursor';
        clearInterval(this.interval!);
        this.interval = null;
    }

    focus() {
        console.log('focusing');
        if (this.interval) return;
        console.log('Making Interval');
        const input = this.getTextArea();
        this.interval = setInterval(() => {
            const cursor = document.getElementById(this.props.id + '-cursor') as HTMLElement;
            if (cursor.className === 'cursor') {
                cursor.className = 'cursor active';
            } else {
                cursor.className = 'cursor';
            }
        }, 500);

        // this.putCursor();

        setTimeout(() => input.focus(), 0);
    }
    componentWillUnmount() {
        if (this.interval) clearInterval(this.interval);
    }
}
