import { hot } from 'react-hot-loader/root';
import * as React from 'react';

import TitleBar from './TitleBar';
import MainPage from './MainPage/MainPage';
import SwitcherContainer from '../containers/SwitcherContainer';

require('../styles/Application.sass');

document.title = 'Charcoal';
const Application = () => (
    <div>
        <TitleBar />
        <div className="big-body">
            <SwitcherContainer>
                <MainPage />
                <div />
            </SwitcherContainer>
        </div>
    </div>
);

export default hot(Application);
