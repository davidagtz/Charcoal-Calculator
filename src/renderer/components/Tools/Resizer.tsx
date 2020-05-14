import React from 'react';

export default class Resizer extends React.Component<{ id: string }> {
    down() {
        this.parent()?.addEventListener('mousemove', this.mousemove);
    }
    up() {
        this.parent()?.removeEventListener('mousemove', this.mousemove);
    }
    mousemove(e: MouseEvent) {
        const parent = this.parent();
        if (!parent) return;
        const percent = (100 * (e.x - parent.getBoundingClientRect().left)) / parent.clientWidth;
        const el = document.getElementById(this.props.id);
        if (!el) return;
        el.style.width = percent + '%';
        el.style.minWidth = percent + '%';
        const child = document.getElementById(this.props.id + '-2')!;
        child.style.width = 100 - percent + '%';
    }
    parent(): HTMLElement | null {
        const el = document.getElementById(this.props.id);
        if (!el) return null;
        return el.parentElement;
    }
    render() {
        const children: any = this.props.children as any;
        return [
            <div
                className="resize"
                key={this.props.id + '-0'}
                id={this.props.id}
                style={{ width: '50%' }}
            >
                {children.slice(0, children.length - 1)}
                <div className="resizer" onMouseDown={this.down} onMouseUp={this.up} />
            </div>,
            <div key={this.props.id + '-1'} id={this.props.id + '-2'} style={{ width: '50%' }}>
                {children[children.length - 1]}
            </div>
        ];
    }
    constructor(props: any) {
        super(props);
        this.mousemove = this.mousemove.bind(this);
        this.up = this.up.bind(this);
        this.down = this.down.bind(this);
    }
}
