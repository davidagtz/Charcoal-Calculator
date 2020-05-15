import { CounterAction } from './counterActions';
import { InputAction } from './formattedInputActions';
import { StyleAction } from './styleActions';
import { OpenPageAction } from './switcherActions';

export type RootActions = InputAction | StyleAction | OpenPageAction;
