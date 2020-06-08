import { connect } from 'react-redux';

import Graph from '../components/MainPage/Graph';
import { RootState } from '../redux/reducers';

const mapStateToProps = (state: RootState) => ({
    expressions: state.input.expressions,
    style: state.style.style
});

export default connect(mapStateToProps)(Graph);
