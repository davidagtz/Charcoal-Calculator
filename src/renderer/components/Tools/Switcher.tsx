import React, { Component } from 'react';

export default class Switcher extends Component<{
    page: number;
    changePage: (page: number) => void;
    children: any;
}> {
    render() {
        if (!(this.props.children! as any).length) {
            return this.props.children;
        }

        if (this.props.page >= (this.props.children as any[]).length) {
            throw new Error('Index not Available');
        }

        return (this.props.children as any)[this.props.page];
    }
    constructor(props: any) {
        super(props);

        document.addEventListener('openPage', (e: any) => {
            this.props.changePage(e.page);
        });
    }
}
