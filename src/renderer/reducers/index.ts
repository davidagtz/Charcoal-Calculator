import { combineReducers } from 'redux';

import { CounterState, counterReducer } from './counterReducer';
import { InputState, formattedInputReducer } from './formattedInputReducer';

export interface RootState {
    counter: CounterState;
    input: InputState;
}

export const rootReducer = combineReducers<RootState | undefined>({
    counter: counterReducer,
    input: formattedInputReducer
});
