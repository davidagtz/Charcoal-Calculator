import { combineReducers } from 'redux';

import { CounterState, counterReducer } from './counterReducer';
import { InputState, formattedInputReducer } from './formattedInputReducer';
import { SwitcherState, switcherReducer } from './switcherReducer';

export interface RootState {
    counter: CounterState;
    input: InputState;
    switcher: SwitcherState;
}

export const rootReducer = combineReducers<RootState | undefined>({
    counter: counterReducer,
    input: formattedInputReducer,
    switcher: switcherReducer
});
