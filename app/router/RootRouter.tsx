import React, {Component} from 'react';


import {BrowserRouter, Route, Routes} from 'react-router-dom';

import ErrorPage from '../pages/ErrorPage';
import HomePage from '../pages/HomePage';
import { AfterLogin } from '../pages/AfterLogin';

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
				<Route path="/after-login" element={<AfterLogin {...this.props}/>}/>
			</Routes>
		</BrowserRouter>;
	}
}
