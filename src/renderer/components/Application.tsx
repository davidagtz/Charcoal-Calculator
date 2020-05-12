import { hot } from 'react-hot-loader/root';
import * as React from 'react';

import TitleBar from './TitleBar';
// import ButtonsContainer from '../containers/ButtonsContainer';
import FormattedInputContainer from '../containers/FormattedInputContainer';
import GraphConatiner from '../containers/GraphContainer';
import Resizer from './Tools/Resizer';
import Buttons from './Buttons';

require('../styles/Application.sass');

document.title = 'Charcoal';
const Application = () => (
    <div>
        <TitleBar />
        <div className="big-body">
            <Resizer id="calc-graph">
                <div id="sidebar">
                    <FormattedInputContainer />
                    <Buttons />
                </div>
                <GraphConatiner id="graph" />
            </Resizer>
        </div>
    </div>
);

export default hot(Application);
