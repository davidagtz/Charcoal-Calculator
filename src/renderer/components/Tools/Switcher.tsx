import React, { Component } from 'react';

export default class Switcher extends Component<{
    page: number;
    changePage: (page: number) => void;
}> {
    render() {
        if (!(this.props.children! as any).length) return this.props.children;
        if (this.props.page >= (this.props.children as any[]).length)
            throw new Error('Index not Available');
        return (this.props.children as any)[this.props.page];
    }
    constructor(props: any) {
        super(props);

        document.addEventListener('openSettings', () => {
            this.props.changePage(1);
        });
    }
}
