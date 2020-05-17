import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Buttons from '../components/MainPage/Buttons';
import { RootState } from '../reducers';
import { InputAction, chgExp } from '../actions/formattedInputActions';

const mapStateToProps = (state: RootState) => ({
    style: state.style.style
});

// const mapDispatchToProps = (dispatch: Dispatch<StyleA>) => ({
//     changeExp: (exp: string) => dispatch(chgExp(exp))
// });

export default connect(mapStateToProps)(Buttons);
