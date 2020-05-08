import { hot } from 'react-hot-loader/root';
import * as React from 'react';

import CounterContainer from '../containers/CounterContainer';
import FormattedInputContainer from '../containers/FormattedInputContainer';
import TitleBar from './TitleBar';
import ButtonsContainer from '../containers/ButtonsContainer';
import Calculator from './Calculator';

require('../styles/Application.sass');

document.title = 'Calculator';
const Application = () => (
    <div>
        <TitleBar />
        <div className="big-body">
            <Calculator />
        </div>
    </div>
);

export default hot(Application);
