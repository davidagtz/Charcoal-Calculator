import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import FormattedInput from '../components/FormattedInput';
import { RootState } from '../reducers';
import { InputAction, chgExp } from '../actions/formattedInputActions';

const mapStateToProps = (state: RootState) => ({
    expression: state.input.expression
});

const mapDispatchToProps = (dispatch: Dispatch<InputAction>) => ({
    changeExp: (exp: string) => dispatch(chgExp(exp))
});

export default connect(mapStateToProps, mapDispatchToProps)(FormattedInput);
