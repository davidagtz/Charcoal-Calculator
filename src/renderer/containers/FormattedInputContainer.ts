import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import FormattedInput from '../components/FormattedInput';
import { RootState } from '../reducers';
import { InputAction, chgExp } from '../actions/formattedInputActions';
import { VarFunction } from '../components/brains/Types';

const mapStateToProps = (state: RootState) => ({
    expression: state.input.expression
});

const mapDispatchToProps = (dispatch: Dispatch<InputAction>) => ({
    changeExpression: (exp: VarFunction) => dispatch(chgExp(exp))
});

export default connect(mapStateToProps, mapDispatchToProps)(FormattedInput);
