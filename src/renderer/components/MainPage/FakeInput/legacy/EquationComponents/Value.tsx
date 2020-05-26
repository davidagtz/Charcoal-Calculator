import React from "react";

export default class Value extends React.Component<{
	value: number | string;
}> {
	render() {
		return <div className="format-value">{this.props.value}</div>;
	}
}
