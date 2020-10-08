import React, { Component } from 'react';

import FormattedInputContainer from '../../containers/FormattedInputContainer';
import GraphContainer from '../../containers/GraphContainer';
import Resizer from '../Tools/Resizer';

export default class extends Component {
    render() {
        return (
            <Resizer id="calc-graph">
                <div id="sidebar">
                    <FormattedInputContainer />
                </div>
                <GraphContainer id="graph" />
            </Resizer>
        );
    }
}
