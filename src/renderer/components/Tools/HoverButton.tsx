import React, { CSSProperties } from 'react';

export default class HoverButton extends React.Component<{
    id?: string;
    style?: CSSProperties;
    onhover?: CSSProperties;
    onactive?: CSSProperties;
    onClick?: any;
    className?: string;
}> {
    state = {
        onHover: false,
        isActive: false
    };
    unhover() {
        this.setState({
            onHover: false
        });
    }
    hover() {
        this.setState({
            onHover: true
        });
    }
    activate() {
        this.setState({
            isActive: true
        });
    }
    deactivate() {
        this.setState({
            isActive: false
        });
    }
    render() {
        let style = this.props.style;
        if (this.props.onactive && this.state.isActive)
            style = { ...style, ...this.props.onactive };
        else if (this.state.onHover) style = { ...style, ...this.props.onhover };
        return (
            <div
                // key={this.props.key}
                id={this.props.id}
                onMouseEnter={this.hover}
                onMouseLeave={this.unhover}
                onMouseDown={this.activate}
                onMouseUp={this.deactivate}
                style={style}
                onClick={this.props.onClick}
                className={this.props.className}
            >
                {this.props.children}
            </div>
        );
    }
    constructor(props: any) {
        super(props);
        this.hover = this.hover.bind(this);
        this.unhover = this.unhover.bind(this);
        this.activate = this.activate.bind(this);
        this.deactivate = this.deactivate.bind(this);
    }
}
