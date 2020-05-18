import { connect } from 'react-redux';

import Buttons from '../components/MainPage/Buttons';
import { RootState } from '../redux/reducers';

const mapStateToProps = (state: RootState) => ({
    style: state.style.style
});

export default connect(mapStateToProps)(Buttons);
