import { hot } from 'react-hot-loader/root';
import * as React from 'react';

import CounterContainer from '../containers/CounterContainer';
import TitleBar from './TitleBar';

require('../styles/Application.sass');

const Application = () => (
    <div>
        <TitleBar />
        <div className="big-body">
            <p>Hello World from Electron!</p>
            <CounterContainer />
        </div>
    </div>
);

export default hot(Application);
