import { Action, ActionCreator } from 'redux';

export const OPEN = 'OPEN';

export interface OpenPageAction extends Action {
    type: 'OPEN';
    page: number;
}

export const openPage: ActionCreator<OpenPageAction> = (page: number) => ({
    page,
    type: OPEN
});
