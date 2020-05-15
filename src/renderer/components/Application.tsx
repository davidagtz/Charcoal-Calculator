import { hot } from 'react-hot-loader/root';
import * as React from 'react';

import MainPage from './MainPage/MainPage';
import SwitcherContainer from '../containers/SwitcherContainer';
import SettingsContainter from '../containers/SettingsContainter';
import TitleBarContainer from '../containers/TitleBarContainer';

require('../styles/Application.sass');

document.title = 'Charcoal';
const Application = () => (
    <div>
        <TitleBarContainer />
        <div className="big-body">
            <SwitcherContainer>
                <MainPage />
                <SettingsContainter />
            </SwitcherContainer>
        </div>
    </div>
);

export default hot(Application);
