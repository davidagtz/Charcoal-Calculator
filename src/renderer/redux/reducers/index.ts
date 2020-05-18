import { combineReducers } from 'redux';

import { InputState, formattedInputReducer } from './formattedInputReducer';
import { SwitcherState, switcherReducer } from './switcherReducer';
import { StyleState, styleReducer } from './styleReducer';

export interface RootState {
    input: InputState;
    switcher: SwitcherState;
    style: StyleState;
}

export const rootReducer = combineReducers<RootState | undefined>({
    input: formattedInputReducer,
    switcher: switcherReducer,
    style: styleReducer
});
