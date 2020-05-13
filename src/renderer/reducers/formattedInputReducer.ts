import { Reducer } from 'redux';

import { CHG_EXP, ADD_EXP, InputAction } from '../actions/formattedInputActions';
import { VarFunction } from '../components/brains/Types';

export interface InputState {
    readonly expressions: VarFunction[];
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
            let expressions = new Array(state.expressions.length)
                .fill(0)
                .map((e, i) => state.expressions[i]);
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
