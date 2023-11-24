import React, { Component } from 'react';

interface Props {
	code?: number,
}

interface State {
}

export default class ErrorPage extends Component<Props, State> {
	render() {
		return <h1>Error</h1>;
	}
}
