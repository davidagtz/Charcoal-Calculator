import { Action, ActionCreator } from 'redux';
import { StyleSchema } from '../components/Tools/brains/Types';

export const CHANGE_STYLE = 'CHANGE_STYLE';

export interface ChgStyleAction extends Action {
    type: 'CHANGE_STYLE';
    style: StyleSchema;
}

export const changeStyle: ActionCreator<ChgStyleAction> = (style: StyleSchema) => ({
    style,
    type: CHANGE_STYLE
});

export type StyleAction = ChgStyleAction;
