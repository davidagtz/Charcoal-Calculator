import React, { Component } from 'React';
import { Resizable } from 're-resizable';
import FormattedInputContainer from '../containers/FormattedInputContainer';
import ButtonsContainer from '../containers/ButtonsContainer';

export default class Calculator extends Component {
    render() {
        return (
            <Resizable
                defaultSize={{
                    width: '50%',
                    height: '75%'
                }}
                minHeight="100%"
                enable={{
                    right: true
                }}
                className="resize"
            >
                <FormattedInputContainer />
                <ButtonsContainer />
            </Resizable>
        );
    }
}
