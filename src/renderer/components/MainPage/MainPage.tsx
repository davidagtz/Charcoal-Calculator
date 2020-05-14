import React, { Component } from 'react';

import FormattedInputContainer from '../../containers/FormattedInputContainer';
import GraphConatiner from '../../containers/GraphContainer';
import Resizer from '../Tools/Resizer';
import Buttons from './Buttons';

export default class extends Component {
    render() {
        return (
            <Resizer id="calc-graph">
                <div id="sidebar">
                    <FormattedInputContainer />
                    <Buttons />
                </div>
                <GraphConatiner id="graph" />
            </Resizer>
        );
    }
}
