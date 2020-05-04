import React, { Component } from 'React';
require('../styles/Buttons.sass');
import PlusMinus from './PlusMinus';

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
            <td>1</td>
            <td>2</td>
            <td>3</td>
        </tr>
    );
    const fourToSix = (
        <tr>
            <td>4</td>
            <td>5</td>
            <td>6</td>
        </tr>
    );
    const sevenToNine = (
        <tr>
            <td>7</td>
            <td>8</td>
            <td>9</td>
        </tr>
    );
    const last = (
        <tr>
            <td>{PlusMinus}</td>
            <td>0</td>
            <td>
                <span className="vertical-center">.</span>
            </td>
        </tr>
    );
    return [oneToThree, fourToSix, sevenToNine, last];
}
