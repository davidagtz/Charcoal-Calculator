import React, { Component } from 'React';
require('../styles/Buttons.sass');
import PlusMinus from './res/PlusMinus';

export default class Buttons extends Component {
    render() {
        return (
            <div id="buttons">
                <table>
                    <tbody>{createNumbers()}</tbody>
                </table>
            </div>
        );
    }
}

function createNumbers() {
    const oneToThree = (
        <tr>
            <td id="1">1</td>
            <td id="2">2</td>
            <td id="3">3</td>
        </tr>
    );
    const fourToSix = (
        <tr>
            <td id="4">4</td>
            <td id="5">5</td>
            <td id="6">6</td>
        </tr>
    );
    const sevenToNine = (
        <tr>
            <td id="7">7</td>
            <td id="8">8</td>
            <td id="9">9</td>
        </tr>
    );
    const last = (
        <tr>
            <td>{PlusMinus}</td>
            <td id="0">0</td>
            <td>
                <span className="vertical-center">.</span>
            </td>
        </tr>
    );
    return [oneToThree, fourToSix, sevenToNine, last];
}

var isActive = false;

export function addListeners() {
    document.addEventListener('keydown', e => {
        if (isActive) return;
        if (e.charCode >= 48 && e.charCode <= 57) {
            addClass(e.key, 'active');
            isActive = true;
        }
    });
    document.addEventListener('keyup', e => {
        if (e.charCode >= 48 && e.charCode <= 57) {
            removeClass(e.key, 'active');
            isActive = false;
        }
    });
}

function addClass(id: string, add: string) {
    document.getElementById(id)!.className += ' ' + add;
}

function removeClass(id: string, remove: string) {
    let c = document.getElementById(id)!.className;
    let classes = c.split(' ');
    classes = classes.filter(e => remove !== e);
    document.getElementById(id)!.className = classes.join(' ');
}
