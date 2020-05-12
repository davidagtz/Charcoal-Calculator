import { Reducer } from 'redux';

import { CHG_EXP, InputAction } from '../actions/formattedInputActions';
import { VarFunction } from '../components/brains/Types';

export interface InputState {
    readonly expression: VarFunction | null;
}

const defaultState: InputState = {
    expression: null
};

export const formattedInputReducer: Reducer<InputState, InputAction> = (
    state = defaultState,
    action: InputAction
) => {
    switch (action.type) {
        case CHG_EXP:
            return {
                ...state,
                expression: action.exp
            };
        default:
            return state;
    }
};
