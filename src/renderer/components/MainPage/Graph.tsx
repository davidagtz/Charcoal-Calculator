import React from 'react';
import Canvas from '../Tools/Canvas';
import { ExpressionProps, StyleSchema } from '../Tools/brains/Types';
import { solve } from '../Tools/brains/Calculator';
require('../../styles/Graph.sass');

interface Props extends ExpressionProps {
    id: string;
    style: StyleSchema;
}

export default class Graph extends Canvas<Props> {
    size: number;
    scaleFactor: number;
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
        const style = this.props.style.Graph;
        const cvs = document.getElementById(this.props.id) as HTMLCanvasElement;
        cvs.width = cvs.clientWidth;
        cvs.height = cvs.clientHeight;
        this.ctx = cvs.getContext('2d');
        const width = cvs.width;
        const height = cvs.height;
        this.width = width;
        this.height = height;

        this.fill(style.background);
        this.background();

        this.translate(width / 2, height / 2);
        this.scaleY(-1);

        this.strokeWeight(6);
        this.stroke(style.axis);
        this.line(-this.offset.x, -height / 2, -this.offset.x, height / 2);
        this.line(-width / 2, -this.offset.y, width / 2, -this.offset.y);

        this.stroke(style.axis + '44');

        const bigAxis = 3;
        const minorAxis = 1;
        for (let i = -1; i * this.size >= -width / 2 + this.offset.x; i -= 1) {
            if (-i % 5 === 0) this.strokeWeight(bigAxis);
            else this.strokeWeight(minorAxis);
            const x = this.size * i - this.offset.x;
            this.line(x, -height / 2, x, height / 2);
            // if(-i % 5) {
            //     this.text(i, )
            // }
        }
        for (let i = 1; i * this.size <= width / 2 + this.offset.x; i += 1) {
            if (i % 5 === 0) this.strokeWeight(bigAxis);
            else this.strokeWeight(minorAxis);
            const x = this.size * i - this.offset.x;
            this.line(x, -height / 2, x, height / 2);
        }
        for (let i = -1; i * this.size >= -height / 2 + this.offset.y; i -= 1) {
            if (-i % 5 === 0) this.strokeWeight(bigAxis);
            else this.strokeWeight(minorAxis);
            const y = this.size * i - this.offset.y;
            this.line(-width / 2, y, width / 2, y);
        }
        for (let i = 1; i * this.size <= height / 2 + this.offset.y; i += 1) {
            if (i % 5 === 0) this.strokeWeight(bigAxis);
            else this.strokeWeight(minorAxis);
            const y = this.size * i - this.offset.y;
            this.line(-width / 2, y, width / 2, y);
        }

        for (let i = 0; i < this.props.expressions.length; i += 1) {
            const eq = this.props.expressions[i];
            if (eq && eq.arguments.length <= 1) {
                this.stroke(
                    this.props.style.Graph.equationColors[
                        i % this.props.style.Graph.equationColors.length
                    ]
                );
                this.strokeWeight(4);

                let prevY = solve(this.toVX(-width / 2), eq);
                prevY = this.fromVY(prevY);

                for (let x = 1 - width / 2; x < width / 2; x += 1) {
                    let newY = solve(this.toVX(x), eq);
                    newY = this.fromVY(newY);
                    this.line(x - 1, prevY, x, newY);
                    prevY = newY;
                }
            }
        }
    }

    toVX(pixel: number) {
        return (this.scaleFactor * (pixel + this.offset.x)) / this.size;
    }

    fromVY(vy: number) {
        return (vy * this.size) / this.scaleFactor - this.offset.y;
    }

    wheel(e: React.WheelEvent<HTMLCanvasElement>) {
        const diff = 1.1;
        if (e.deltaY > 0) {
            this.size *= diff;
        } else if (e.deltaY < 0) {
            this.size /= diff;
        }

        if (this.size < 20) {
            this.size *= 5;
            this.scaleFactor *= 5;
        } else if (this.size > 75) {
            this.size /= 5;
            this.scaleFactor /= 5;
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
        this.size = (75 + 20) / 2;
        this.offset = {
            x: 0,
            y: 0
        };
        this.mouse = {
            active: false,
            x: 0,
            y: 0
        };
        this.scaleFactor = 1;
        this.down = this.down.bind(this);
        this.up = this.up.bind(this);
        this.drag = this.drag.bind(this);
        this.wheel = this.wheel.bind(this);
    }
}
