import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import TitleBar from '../components/TitleBar';
import { RootState } from '../redux/reducers';
import { StyleAction, changeStyle } from '../redux/actions/styleActions';
import { StyleSchema } from '../components/Tools/brains/Types';

const mapStateToProps = (state: RootState) => ({
    style: state.style.style
});

const mapDispatchToProps = (dispatch: Dispatch<StyleAction>) => ({
    changeStyle: (style: StyleSchema) => dispatch(changeStyle(style))
});

export default connect(mapStateToProps, mapDispatchToProps)(TitleBar);
