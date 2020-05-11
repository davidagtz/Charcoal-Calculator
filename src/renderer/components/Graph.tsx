import React from 'React';
import Canvas from './Tools/Canvas';
require('../styles/Graph.sass');

export default class Graph extends Canvas<{ id: string }> {
    size: number;

    render() {
        return (
            <div id={this.props.id + '-parent'} onScroll={this.scroll.bind(this)}>
                <canvas id={this.props.id} />;
            </div>
        );
    }

    componentDidUpdate() {
        let cvs: any = document.getElementById(this.props.id);
        let cvs_parent: any = document.getElementById(this.props.id + '-parent');
        cvs_parent.scrollTop = (cvs_parent.scrollHeight - cvs_parent.clientHeight) / 2;
        cvs.width = cvs.clientWidth;
        cvs.height = cvs.clientHeight;
        this.ctx = cvs.getContext('2d');
        const width: number = cvs.width;
        const height: number = cvs.height;
        this.width = width;
        this.height = height;

        this.background();

        this.strokeWeight(4);
        this.stroke('#994d00');
        this.line(width / 2, 0, width / 2, height);
        this.line(0, height / 2, width, height / 2);

        this.stroke('#994d0044');
        for (let i = width / 2; i < width; i += this.size) {
            if (((i - width / 2) / this.size) % 5 === 0) this.strokeWeight(3);
            else this.strokeWeight(1);
            this.line(i, 0, i, height);
        }
        for (let i = width / 2; i >= 0; i -= this.size) {
            if (((i - width / 2) / this.size) % 5 === 0) this.strokeWeight(3);
            else this.strokeWeight(1);
            this.line(i, 0, i, height);
        }
        for (let i = height / 2; i < height; i += this.size) {
            if (((i - height / 2) / this.size) % 5 === 0) this.strokeWeight(3);
            else this.strokeWeight(1);
            this.line(0, i, width, i);
        }
        for (let i = height / 2; i >= 0; i -= this.size) {
            if (((i - height / 2) / this.size) % 5 === 0) this.strokeWeight(3);
            else this.strokeWeight(1);
            this.line(0, i, width, i);
        }

        setTimeout(() => this.componentDidUpdate(), 100);
    }

    scroll(e: React.UIEvent<HTMLDivElement>) {
        let cvs_parent: any = document.getElementById(this.props.id + '-parent');
        let avg = (cvs_parent.scrollHeight - cvs_parent.clientHeight) / 2;
        avg = Math.floor(avg);
        const diff = 5;
        if (cvs_parent.scrollTop < avg) this.size += diff;
        else if (this.size > diff && cvs_parent.scrollTop !== avg) this.size -= diff;
        cvs_parent.scrollTop = avg;
    }

    constructor(props: any) {
        super(props);
        this.componentDidMount = () => {
            document.getElementById('graph')?.addEventListener;
            this.componentDidUpdate();
        };
        this.size = 15;
    }
}
