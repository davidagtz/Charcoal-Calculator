import { Reducer } from 'redux';

import { CHG_EXP, ADD_EXP, InputAction } from '../actions/formattedInputActions';
import { VarFunction } from '../../components/Tools/brains/Types';

export interface InputState {
    readonly expressions: (VarFunction | null)[];
}

const defaultState: InputState = {
    expressions: []
};

export const formattedInputReducer: Reducer<InputState, InputAction> = (
    state = defaultState,
    action: InputAction
) => {
    switch (action.type) {
        case CHG_EXP:
            const expressions = [...state.expressions];
            expressions[action.i] = action.exp;
            return {
                ...state,
                expressions
            };
        case ADD_EXP:
            return {
                ...state,
                expressions: state.expressions.concat(action.exp)
            };
        default:
            return state;
    }
};
