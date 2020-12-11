import React, { CSSProperties } from 'react';
import ErrorFreeParser from '../../Tools/brains/ErrorFreeParser';
import { charFormatHTML } from './FormatterHTML';
import './FakeInput.sass';
import './EquationComponents.sass';
import { nativeImage } from 'electron';

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
    top = 0;
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
                    <span>
                        <div ref={this.cursorRef} className="cursor" />
                        <div ref={this.replaceRef}>
                            <div id={`${id}-fo`} />
                        </div>
                    </span>
                </span>
            </div>
        );
    }

    onChange() {
        const textArea = this.getTextArea();
        const val = textArea.value;
        if (
            val[val.length - 1] === '\n' ||
            (val[val.length - 1] === '^' && val[val.length - 2] === '^')
        ) {
            textArea.value = val.substring(0, val.length - 1);
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
        // Equation Container
        const eq = document.getElementById(this.props.id + '-fo') as HTMLDivElement;

        // Reset Cursor Styling
        const cursor = this.getCursor();
        if (eq.children.length !== 0) {
            cursor.style.height = getComputedStyle(this.replaceRef.current!).height;
        } else {
            cursor.style.height = '1em';
        }
        this.setTop(0);

        // Cursor Index
        this.find = this.getTextArea().selectionStart;
        // Current Index
        this.index = 0;
        // Real X
        this.x = cursor.clientWidth;

        if (this.find === 0 && eq.children.length === 0) {
            cursor.style.left = '0';
            return;
        }

        this._put(eq);
        // console.log(this.top);
    }

    /**
     * This function places the cursor where the text
     * is selected in the textarea.
     *
     * @param {string} el The element to use
     * @return {boolean} Whether cursor was found
     */
    _put(el: Element): boolean {
        const cursor = this.getCursor();
        const find = this.find;

        // console.log(el.className);
        if (el.className === 'format-division') {
            const totalWidth = el.getBoundingClientRect().width;

            // Saved styles
            const top = this.top;
            const height = cursor.style.height;
            const prevX = this.x;

            cursor.style.height = `${el.children[0].getBoundingClientRect().height}px`;
            const w1 = el.children[0].getBoundingClientRect().width;
            this.x += (totalWidth - w1) / 2;
            if (this._put(el.children[0])) return true;

            cursor.style.height = `${el.children[2].getBoundingClientRect().height}px`;
            this.index++;
            const b2 = el.children[2].getBoundingClientRect();
            const w2 = b2.width;
            this.top = b2.y - el.getBoundingClientRect().y;
            this.x = prevX + (totalWidth - w2) / 2;
            if (this._put(el.children[2])) return true;

            // Returning styles
            this.top = top;
            cursor.style.height = height;
            // Adding total division
            this.x = prevX + totalWidth;
            return false;
        } else if (el.className === 'format-value') {
            // The distance to the desired index
            const DIST = find - this.index;

            // The Numeric Value of the div
            const value = el.innerHTML;

            // Check if the desired index is in middle of the value
            if (DIST >= 0 && DIST <= value.length) {
                // Width of start to desired index
                const nX = this.textWidth(value.substring(0, DIST), getComputedStyle(el).font);
                cursor.style.left = `${this.x + nX}px`;
                cursor.style.top = `${this.top}px`;
                return true;
            }

            this.x += el.clientWidth;
            this.index += value.length;
            return false;
        }

        for (let i = 0; i < el.children.length; i++) {
            // Child to be evaluated
            const child = el.children[i];
            // The distance to the desired index
            const DIST = find - this.index;

            if (child.className === 'sign') {
                const nX = child.getBoundingClientRect().width;

                // After the sign
                if (DIST === 1) {
                    cursor.style.top = `${this.top}px`;
                    cursor.style.left = `${this.x + nX}px`;
                    return true;
                }
                // Before the sign
                else if (DIST === 0) {
                    cursor.style.top = `${this.top}px`;
                    cursor.style.left = `${this.x}px`;
                    return true;
                }

                this.x += nX;
                this.index++;
            } else if (child.className === 'raise') {
                // Between the exponent and base
                if (DIST >= 0 && DIST <= 1) {
                    cursor.style.left = this.x + 'px';
                    cursor.style.height = child.clientHeight + 'px';
                    this.setTop(child.getBoundingClientRect().y - el.getBoundingClientRect().y);
                    return true;
                }
                this.index++;

                const top = this.top;
                const height = cursor.style.height;
                this.top = child.getBoundingClientRect().y - el.getBoundingClientRect().y;
                cursor.style.height = child.clientHeight + 'px';
                if (this._put(child)) return true;
                this.top = top;
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

    getTextArea() {
        return this.textAreaRef.current!;
    }

    getText() {
        return this.getTextArea().value;
    }

    getCursor() {
        return this.cursorRef.current!;
    }

    moveTop(dx: number) {
        this.setTop(this.top + dx);
    }

    setTop(y: number) {
        this.top = y;
        this.getCursor().style.top = `${this.top}px`;
    }
}
