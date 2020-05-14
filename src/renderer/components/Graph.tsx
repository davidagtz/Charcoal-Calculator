import React from 'react';
import Canvas from './Tools/Canvas';
import { ExpressionProps } from './brains/Types';
import { solve } from './brains/Calculator';
require('../styles/Graph.sass');

interface Props extends ExpressionProps {
    id: string;
}

export default class Graph extends Canvas<Props> {
    size: number;
    offset: {
        x: number;
        y: number;
    };
    mouse: {
        active: boolean;
        x: number;
        y: number;
    };

    render() {
        return (
            <div
                id={this.props.id + '-parent'}
                onScroll={this.scroll}
                onMouseDown={this.down}
                onMouseUp={this.up}
                onMouseMove={this.drag}
            >
                <canvas id={this.props.id} />
            </div>
        );
    }

    componentDidUpdate() {
        const cvs: HTMLCanvasElement = document.getElementById(this.props.id) as HTMLCanvasElement;
        const cvs_parent: HTMLDivElement = document.getElementById(
            this.props.id + '-parent'
        ) as HTMLDivElement;
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
        this.line(-this.offset.x, -height / 2, -this.offset.x, height / 2);
        this.line(-width / 2, -this.offset.y, width / 2, -this.offset.y);

        this.stroke('#994d0044');

        for (let i = -1; i * this.size >= -width / 2 + this.offset.x; i -= 1) {
            if (-i % 5 === 0) this.strokeWeight(3);
            else this.strokeWeight(1);
            const x = this.size * i - this.offset.x;
            this.line(x, -height / 2, x, height / 2);
        }
        for (let i = 1; i * this.size <= width / 2 + this.offset.x; i += 1) {
            if (i % 5 === 0) this.strokeWeight(3);
            else this.strokeWeight(1);
            const x = this.size * i - this.offset.x;
            this.line(x, -height / 2, x, height / 2);
        }
        for (let i = -1; i * this.size >= -height / 2 + this.offset.y; i -= 1) {
            if (-i % 5 === 0) this.strokeWeight(3);
            else this.strokeWeight(1);
            const y = this.size * i - this.offset.y;
            this.line(-width / 2, y, width / 2, y);
        }
        for (let i = 1; i * this.size <= height / 2 + this.offset.y; i += 1) {
            if (i % 5 === 0) this.strokeWeight(3);
            else this.strokeWeight(1);
            const y = this.size * i - this.offset.y;
            this.line(-width / 2, y, width / 2, y);
        }

        for (let i = 0; i < this.props.expressions.length; i += 1) {
            const eq = this.props.expressions[i];
            if (eq && eq.arguments.length <= 1) {
                this.stroke('#00f');
                this.strokeWeight(4);

                let prevY = solve((-width / 2 + this.offset.x) / this.size, eq);
                prevY *= this.size;
                prevY -= this.offset.y;

                for (let x = 1 - width / 2; x < width / 2; x += 1) {
                    let newY = solve((x + this.offset.x) / this.size, eq);
                    newY *= this.size;
                    newY -= this.offset.y;
                    this.line(x - 1, prevY, x, newY);
                    prevY = newY;
                }
            }
        }
    }

    scroll() {
        const cvs_parent = document.getElementById(this.props.id + '-parent') as HTMLDivElement;
        let avg = (cvs_parent.scrollHeight - cvs_parent.clientHeight) / 2;
        avg = Math.floor(avg);
        const diff = 1.1;
        if (cvs_parent.scrollTop < avg) {
            this.size *= diff;
        } else if (cvs_parent.scrollTop !== avg) {
            this.size /= diff;
        }
        cvs_parent.scrollTop = avg;
        this.componentDidUpdate();
    }

    down(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        this.mouse.active = true;
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    }

    up() {
        this.mouse.active = false;
    }
    drag(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (!this.mouse.active) return;
        this.offset.x += this.mouse.x - e.clientX;
        this.offset.y -= this.mouse.y - e.clientY;
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        this.componentDidUpdate();
    }

    constructor(props: any) {
        super(props);
        this.componentDidMount = () => {
            window.addEventListener('resize', this.componentDidUpdate.bind(this));
            document
                .querySelector('#calc-graph .resizer')
                ?.addEventListener('mousemove', this.componentDidUpdate.bind(this));
            this.componentDidUpdate();
        };
        this.size = 15;
        this.offset = {
            x: 0,
            y: 0
        };
        this.mouse = {
            active: false,
            x: 0,
            y: 0
        };
        this.down = this.down.bind(this);
        this.up = this.up.bind(this);
        this.drag = this.drag.bind(this);
        this.scroll = this.scroll.bind(this);

        // window.addEventListener('resize', this.componentDidUpdate);
        // window.addEventListener('resize', () => console.log('HEYY'));
    }
}
