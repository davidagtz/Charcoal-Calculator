import { Action, ActionCreator } from 'redux';
import { VarFunction } from '../components/brains/Types';

export const CHG_EXP = 'CHG_EXP';

export interface ChgExpAction extends Action {
    type: 'CHG_EXP';
    exp: VarFunction;
}

export const chgExp: ActionCreator<ChgExpAction> = exp => ({
    exp,
    type: CHG_EXP
});

export type InputAction = ChgExpAction;
