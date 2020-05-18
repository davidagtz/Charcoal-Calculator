import { Reducer } from 'redux';

import { CHANGE_STYLE, StyleAction } from '../actions/styleActions';
import { StyleSchema } from '../../components/Tools/brains/Types';
let def = require('../../themes/Charcoal.json');

export interface StyleState {
    readonly style: StyleSchema;
}

const defaultState: StyleState = {
    style: def
};

export const styleReducer: Reducer<StyleState, StyleAction> = (
    state = defaultState,
    action: StyleAction
) => {
    switch (action.type) {
        case CHANGE_STYLE:
            return {
                style: action.style
            };
        default:
            return state;
    }
};
