import { Reducer } from 'redux';

import { OPEN, OpenPageAction } from '../actions/switcherActions';

export interface SwitcherState {
    readonly page: number;
}

const defaultState: SwitcherState = {
    page: 0
};

export const switcherReducer: Reducer<SwitcherState, OpenPageAction> = (
    state = defaultState,
    action: OpenPageAction
) => {
    switch (action.type) {
        case OPEN:
            return {
                page: action.page
            };
        default:
            return state;
    }
};
