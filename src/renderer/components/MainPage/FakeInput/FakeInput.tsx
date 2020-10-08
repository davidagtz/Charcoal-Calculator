import React, { CSSProperties } from 'react';
import ErrorFreeParser from '../../Tools/brains/ErrorFreeParser';
import { charFormatHTML } from './FormatterHTML';
require('./FakeInput.sass');
require('./EquationComponents.sass');

export default class FakeInput extends React.Component<{
    style: CSSProperties;
    id: string;
    onKeyPress?: (e: React.KeyboardEvent<Element>, ...args: any[]) => void;
    className?: string;
    onChange?: () => void;
    'data-key'?: number;
}> {
    interval = null as null | NodeJS.Timeout;
    x = 0;
    textAreaRef: React.RefObject<HTMLTextAreaElement>;
    cursorRef: React.RefObject<HTMLDivElement>;
    replaceRef: React.RefObject<HTMLDivElement>;

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

        this.textAreaRef = React.createRef();
        this.cursorRef = React.createRef();
        this.replaceRef = React.createRef();
    }

    prev: string = '1';
    render() {
        const { id } = this.props;

        return (
            <div
                className={`fake-input ${this.props.className ? this.props.className : ''}`}
                style={this.props.style}
                onMouseDown={this.focus}
            >
                <textarea
                    ref={this.textAreaRef}
                    className="hide-text"
                    id={`${id}-text`}
                    onChange={this.onChange}
                    onBlur={this.blur}
                    onKeyUp={this.onKeyPress}
                    onFocus={this.focus}
                    data-key={this.props['data-key']}
                />
                <span>
                    <div ref={this.cursorRef} className="cursor" />
                    <div ref={this.replaceRef}>
                        <div id={`${id}-fo`} />
                    </div>
                </span>
            </div>
        );
    }

    onChange() {
        const textArea = this.getTextArea();
        const val = textArea.value;
        if (val[val.length - 1] === '\n') {
            textArea.value = val.substring(0, val.length);
            return;
        }
        this.changeText();
        if (this.props.onChange) this.props.onChange();
    }

    onKeyPress(e: React.KeyboardEvent<Element>) {
        this.putCursor();
        if (this.props.onKeyPress) {
            this.props.onKeyPress(e, this.prev);
        }
        this.prev = this.getText();
    }

    changeText() {
        const replace = this.replaceRef.current!;
        replace.innerHTML = '';

        const parser = new ErrorFreeParser(this.getText());
        replace.appendChild(charFormatHTML(parser.parseAll(), this.props.id + '-fo'));
    }

    index = 0;
    find = 0;
    putCursor() {
        const eq = document.getElementById(this.props.id + '-fo') as HTMLDivElement;

        const cursor = this.getCursor();
        cursor.style.height = '0';
        cursor.style.height = getComputedStyle(this.replaceRef.current!).height;
        cursor.style.top = '0';

        this.find = this.getTextArea().selectionStart;
        this.index = 0;
        this.x = cursor.clientWidth;

        if (this.find === 0 && eq.children.length === 0) {
            cursor.style.left = '0';
            return;
        }

        this._put(eq);
    }

    _put(this: any, el: Element): boolean {
        const cursor = this.getCursor();
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
                    cursor.style.left = `${this.x + nX}px`;

                    return true;
                }
                this.x += child.clientWidth;
                this.index += value.length;
            } else if (child.className === 'sign') {
                const nX = child.getBoundingClientRect().width;
                if (this.index <= find && find <= this.index + 1) {
                    cursor.style.left = `${this.x + nX}px`;
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
        return this.textAreaRef.current!;
    }

    getText() {
        return this.getTextArea().value;
    }

    getCursor() {
        return this.cursorRef.current!;
    }

    blur() {
        this.getCursor().className = 'cursor';
        clearInterval(this.interval!);
        this.interval = null;
    }

    focus() {
        if (this.interval) return;

        this.interval = setInterval(() => {
            const cursor = this.getCursor();
            if (cursor.className === 'cursor') {
                cursor.className = 'cursor active';
            } else {
                cursor.className = 'cursor';
            }
        }, 500);

        setTimeout(() => this.getTextArea().focus(), 0);
    }

    componentWillUnmount() {
        if (this.interval) clearInterval(this.interval);
    }
}
