import React, { Component, FC } from 'react';

interface Props {
	code?: number,
}

interface State {
}

export const ErrorPage: FC<Props> = () => {
	return <h1>Error</h1>;
}

export default ErrorPage
