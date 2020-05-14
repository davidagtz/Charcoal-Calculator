import React from 'react';
import Canvas from '../Tools/Canvas';
import { ExpressionProps } from '../Tools/brains/Types';
import { solve } from '../Tools/brains/Calculator';
require('../../styles/Graph.sass');

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
    colors: string[];

    render() {
        return (
            <canvas
                id={this.props.id}
                onWheel={this.wheel}
                onMouseDown={this.down}
                onMouseUp={this.up}
                onMouseMove={this.drag}
            />
        );
    }

    componentDidUpdate() {
        const cvs = document.getElementById(this.props.id) as HTMLCanvasElement;
        cvs.width = cvs.clientWidth;
        cvs.height = cvs.clientHeight;
        this.ctx = cvs.getContext('2d');
        const width = cvs.width;
        const height = cvs.height;
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
                this.stroke(this.colors[i % this.colors.length]);
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

    wheel(e: React.WheelEvent<HTMLCanvasElement>) {
        const diff = 1.1;
        if (e.deltaY > 0) {
            this.size *= diff;
        } else if (e.deltaY < 0) {
            this.size /= diff;
        }
        this.componentDidUpdate();
    }

    down(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        this.mouse.active = true;
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    }

    up() {
        this.mouse.active = false;
    }
    drag(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
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
        this.wheel = this.wheel.bind(this);

        this.colors = ['#02a2ff', '#ff0252', '#52ff02'];
    }
}
