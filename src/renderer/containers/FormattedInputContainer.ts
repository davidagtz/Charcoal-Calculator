import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import FormattedInput from '../components/FormattedInput';
import { RootState } from '../reducers';
import { InputAction, chgExp, addExp } from '../actions/formattedInputActions';
import { VarFunction } from '../components/brains/Types';

const mapStateToProps = (state: RootState) => ({
    expressions: state.input.expressions
});

const mapDispatchToProps = (dispatch: Dispatch<InputAction>) => ({
    changeExpression: (i: number, exp: VarFunction) => dispatch(chgExp(i, exp)),
    addExpression: (exp: VarFunction) => dispatch(addExp(exp))
});

export default connect(mapStateToProps, mapDispatchToProps)(FormattedInput);
