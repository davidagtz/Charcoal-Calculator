import React, { ReactNode } from 'React';

export default class Resizer extends React.Component<{ id: string }> {
    down() {
        this.parent()?.addEventListener('mousemove', this.mousemove);
    }
    up() {
        this.parent()?.removeEventListener('mousemove', this.mousemove);
    }
    mousemove(e: MouseEvent) {
        let parent = this.parent();
        if (!parent) return;
        let percent = (100 * (e.x - parent.getBoundingClientRect().left)) / parent.clientWidth;
        let el = document.getElementById(this.props.id);
        if (!el) return;
        el.style.width = percent + '%';
        el.style.minWidth = percent + '%';
        let child: any = document.getElementById(this.props.id + '-2');
        child.style.width = 100 - percent + '%';
    }
    parent(): HTMLElement | null {
        let el = document.getElementById(this.props.id);
        if (!el) return null;
        return el.parentElement;
    }
    render() {
        let children: any = this.props.children as any;
        return [
            <div className="resize" id={this.props.id} style={{ width: '50%' }}>
                {children.slice(0, children.length - 1)}
                <div
                    className="resizer"
                    onMouseDown={this.down.bind(this)}
                    onMouseUp={this.up.bind(this)}
                ></div>
            </div>,
            <div id={this.props.id + '-2'} style={{ width: '50%' }}>
                {children[children.length - 1]}
            </div>
        ];
    }
    constructor(props: any) {
        super(props);
        this.mousemove = this.mousemove.bind(this);
    }
}
