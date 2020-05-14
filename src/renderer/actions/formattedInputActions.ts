import { Action, ActionCreator } from 'redux';
import { VarFunction } from '../components/Tools/brains/Types';

export const CHG_EXP = 'CHG_EXP';
export const ADD_EXP = 'ADD_EXP';

export interface ChgExpAction extends Action {
    type: 'CHG_EXP';
    i: number;
    exp: VarFunction | null;
}
export interface AddExpAction extends Action {
    type: 'ADD_EXP';
    exp: VarFunction | null;
}

export const chgExp: ActionCreator<ChgExpAction> = (i: number, exp: VarFunction | null) => ({
    exp,
    i,
    type: CHG_EXP
});

export const addExp: ActionCreator<AddExpAction> = (exp: VarFunction | null) => ({
    exp,
    type: ADD_EXP
});

export type InputAction = ChgExpAction | AddExpAction;
