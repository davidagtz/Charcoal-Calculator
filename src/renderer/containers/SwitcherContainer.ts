import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Switcher from '../components/Tools/Switcher';
import { RootState } from '../redux/reducers';
import { OpenPageAction, openPage } from '../redux/actions/switcherActions';

const mapStateToProps = (state: RootState) => ({
    page: state.switcher.page
});

const mapDispatchToProps = (dispatch: Dispatch<OpenPageAction>) => ({
    changePage: (page: number) => dispatch(openPage(page))
});

export default connect(mapStateToProps, mapDispatchToProps)(Switcher);
