import React from 'react';
import Canvas from '../Tools/Canvas';
import { StyleSchema, VarFunction } from '../Tools/brains/Types';
import { solve } from '../Tools/brains/Calculator';
import Home from '../res/Home';
require('./styles/Graph.sass');

interface Props {
    id: string;
    style: StyleSchema;
    expressions: {
        [index: number]: VarFunction;
    };
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
    onEvery = 5;
    bigAxis = 3;
    minorAxis = 1;

    render() {
        return (
            <div id={this.props.id + '-parent'}>
                <canvas
                    id={this.props.id}
                    onWheel={this.wheel}
                    onMouseDown={this.down}
                    onMouseUp={this.up}
                    onMouseMove={this.drag}
                />
                <div id={this.props.id + '-home'} onClick={this.reset}>
                    <Home fill={this.props.style.Graph.font} />
                </div>
            </div>
        );
    }

    componentDidUpdate() {
        const style = this.props.style.Graph;
        this.setup(this.props.id);
        const width = this.width;
        const height = this.height;

        this.fill(style.background);
        this.background();

        this.translate(width / 2, height / 2);
        this.scaleY(-1);

        this.strokeWeight(5);
        this.stroke(style.axis);
        this.line(-this.offset.x, -height / 2, -this.offset.x, height / 2);
        this.line(-width / 2, -this.offset.y, width / 2, -this.offset.y);

        this.stroke(style.axis + '44');

        this.fill(style.font);
        for (let i = -1; i * this.size >= -width / 2 + this.offset.x; i -= 1) {
            this.chooseStroke(i);
            const x = this.size * i - this.offset.x;
            this.line(x, -height / 2, x, height / 2);
            if (i % this.onEvery === 0) {
                this.text(`${this.scaleFactor * i}`, x, -this.offset.y);
            }
        }
        for (let i = 1; i * this.size <= width / 2 + this.offset.x; i += 1) {
            this.chooseStroke(i);
            const x = this.size * i - this.offset.x;
            this.line(x, -height / 2, x, height / 2);
            if (i % this.onEvery === 0) {
                this.text(`${this.scaleFactor * i}`, x, -this.offset.y);
            }
        }
        for (let i = -1; i * this.size >= -height / 2 + this.offset.y; i -= 1) {
            this.chooseStroke(i);
            const y = this.size * i - this.offset.y;
            this.line(-width / 2, y, width / 2, y);
            if (i % this.onEvery === 0) {
                this.text(`${this.scaleFactor * i}`, -this.offset.x, y);
            }
        }
        for (let i = 1; i * this.size <= height / 2 + this.offset.y; i += 1) {
            this.chooseStroke(i);
            const y = this.size * i - this.offset.y;
            this.line(-width / 2, y, width / 2, y);
            if (i % this.onEvery === 0) {
                this.text(`${this.scaleFactor * i}`, -this.offset.x, y);
            }
        }

        let i = 0;
        for (const key in this.props.expressions) {
            const eq = this.props.expressions[key];
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
            i++;
        }
    }

    chooseStroke(count: number) {
        if (count % this.onEvery === 0) this.strokeWeight(this.bigAxis);
        else this.strokeWeight(this.minorAxis);
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
        } else if (this.size > 50) {
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
    componentDidMount() {
        window.addEventListener('resize', this.componentDidUpdate.bind(this));
        document
            .querySelector('#calc-graph .resizer')
            ?.addEventListener('mousemove', this.componentDidUpdate.bind(this));
        this.componentDidUpdate();
    }

    constructor(props: any) {
        super(props);
        this.size = (50 + 20) / 2;
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
        this.reset = this.reset.bind(this);
    }

    reset() {
        this.size = (50 + 20) / 2;
        this.scaleFactor = 1;
        this.offset = {
            x: 0,
            y: 0
        };
        this.mouse = {
            active: false,
            x: 0,
            y: 0
        };
        this.componentDidUpdate();
    }
}
