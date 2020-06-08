import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import FormattedInput from '../components/MainPage/FormattedInput';
import { RootState } from '../redux/reducers';
import { InputAction, chgExp } from '../redux/actions/formattedInputActions';
import { VarFunction } from '../components/Tools/brains/Types';

const mapStateToProps = (state: RootState) => ({
    expressions: state.input.expressions,
    style: state.style.style
});

const mapDispatchToProps = (dispatch: Dispatch<InputAction>) => ({
    changeExpression: (i: number, exp: VarFunction | null) => dispatch(chgExp(i, exp))
});

export default connect(mapStateToProps, mapDispatchToProps)(FormattedInput);
