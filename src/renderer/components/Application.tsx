import { hot } from 'react-hot-loader/root';
import * as React from 'react';

import TitleBar from './TitleBar';
import ButtonsContainer from '../containers/ButtonsContainer';
import FormattedInputContainer from '../containers/FormattedInputContainer';
import Graph from './Graph';
import Resizer from './Tools/Resizer';

require('../styles/Application.sass');

document.title = 'Charcoal';
const Application = () => (
    <div>
        <TitleBar />
        <div className="big-body">
            <Resizer id="calc-graph">
                <FormattedInputContainer />
                <ButtonsContainer />
                <Graph id="graph" />
            </Resizer>
        </div>
    </div>
);

export default hot(Application);
