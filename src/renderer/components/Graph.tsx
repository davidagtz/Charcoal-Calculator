import React from 'React';
import Canvas from './Tools/Canvas';
import { VarFunction } from './brains/Types';
import { solve } from './brains/Calculator';
require('../styles/Graph.sass');

export default class Graph extends Canvas<{ id: string; expression: VarFunction | null }> {
    size: number;
    equations: VarFunction | null;

    render() {
        return (
            <div id={this.props.id + '-parent'} onScroll={this.scroll.bind(this)}>
                <canvas id={this.props.id} />;
            </div>
        );
    }

    componentDidUpdate() {
        this.equations = this.props.expression;
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

        this.translate(width / 2, height / 2);
        this.scaleY(-1);

        this.strokeWeight(4);
        this.stroke('#994d00');
        this.line(0, -height / 2, 0, height / 2);
        this.line(-width / 2, 0, width / 2, 0);

        this.stroke('#994d0044');
        for (let i = 0; i < width / 2; i += this.size) {
            if ((i / this.size) % 5 === 0) this.strokeWeight(3);
            else this.strokeWeight(1);

            this.line(i, -height / 2, i, height / 2);
        }
        for (let i = 0; i >= -width / 2; i -= this.size) {
            if ((i / this.size) % 5 === 0) this.strokeWeight(3);
            else this.strokeWeight(1);
            this.line(i, -height / 2, i, height / 2);
        }
        for (let i = 0; i < height / 2; i += this.size) {
            if ((i / this.size) % 5 === 0) this.strokeWeight(3);
            else this.strokeWeight(1);
            this.line(-width / 2, i, width / 2, i);
        }
        for (let i = 0; i >= -height / 2; i -= this.size) {
            if ((i / this.size) % 5 === 0) this.strokeWeight(3);
            else this.strokeWeight(1);
            this.line(-width / 2, i, width / 2, i);
        }

        if (this.equations && this.equations.arguments.length <= 1) {
            this.stroke('#00f');
            this.strokeWeight(4);

            let y = this.size * solve(-width / 2 / this.size, this.equations);
            for (let x = -width / 2 + 1; x < width / 2; x += 1) {
                let ny = this.size * solve(x / this.size, this.equations);
                this.line(x - 1, y, x, ny);
                y = ny;
            }
        }

        setTimeout(() => this.componentDidUpdate(), 100);
    }

    scroll() {
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
        this.equations = null;
    }
}
