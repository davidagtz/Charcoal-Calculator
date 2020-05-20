import React from 'react';

export default class Value extends React.Component<{
    value: number | string;
}> {
    render() {
        return <div className="value">{this.props.value}</div>;
    }
}
