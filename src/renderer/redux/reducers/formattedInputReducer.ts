import { Reducer } from 'redux';

import { CHG_EXP, InputAction } from '../actions/formattedInputActions';
import { VarFunction } from '../../components/Tools/brains/Types';

export interface InputState {
    readonly expressions: {
        [index: number]: VarFunction;
    };
}

const defaultState: InputState = {
    expressions: {}
};

export const formattedInputReducer: Reducer<InputState, InputAction> = (
    state = defaultState,
    action: InputAction
) => {
    switch (action.type) {
        case CHG_EXP:
            const expressions = { ...state.expressions };

            if (!action.exp) delete expressions[action.i];
            else expressions[action.i] = action.exp;

            return {
                expressions
            };
        default:
            return state;
    }
};
