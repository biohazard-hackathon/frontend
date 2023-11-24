import React, {Component} from 'react';


import {BrowserRouter, Route, Routes} from 'react-router-dom';

import ErrorPage from '../pages/ErrorPage';
import HomePage from '../pages/HomePage';

interface Props {
}

interface State {
}

export default class RootRouter extends Component<Props, State> {
	render() {
		return <BrowserRouter>
			<Routes>
				<Route path="/" element={<HomePage {...this.props}/>}/>
				<Route path="*" element={<ErrorPage {...this.props}/>}/>
			</Routes>
		</BrowserRouter>;
	}
}
