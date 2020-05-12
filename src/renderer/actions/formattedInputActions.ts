import { Action, ActionCreator } from 'redux';
import { VarFunction } from '../components/brains/Types';

export const CHG_EXP = 'CHG_EXP';
export const ADD_EXP = 'ADD_EXP';

export interface ChgExpAction extends Action {
    type: 'CHG_EXP';
    i: number;
    exp: VarFunction;
}
export interface AddExpAction extends Action {
    type: 'ADD_EXP';
    exp: VarFunction;
}

export const chgExp: ActionCreator<ChgExpAction> = (i: number, exp: VarFunction) => ({
    exp,
    i,
    type: CHG_EXP
});

export const addExp: ActionCreator<AddExpAction> = exp => ({
    exp,
    type: ADD_EXP
});

export type InputAction = ChgExpAction | AddExpAction;
