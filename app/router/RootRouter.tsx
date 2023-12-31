import React, {Component} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import ErrorPage from '../pages/ErrorPage';
import HomePage from '../pages/HomePage';
import { AfterLogin } from '../pages/AfterLogin';
import { Analyse } from '../pages/Analyse';
import { Logout } from '../pages/Logout';
import { BiopsyList } from '../pages/BiopsyList';
import { Biopsy } from '../pages/Biopsy';
import { Dashboard } from '../pages/Dashboard';

interface Props {
}

interface State {
}

export default class RootRouter extends Component<Props, State> {
	render() {
		return <BrowserRouter>
			<Routes>
				<Route path="/" element={<Dashboard {...this.props}/>}/>
				<Route path="*" element={<ErrorPage {...this.props}/>}/>
				<Route path="/after-login" element={<AfterLogin {...this.props}/>}/>
				<Route path="/biopsies" element={<BiopsyList {...this.props}/>}/>
				<Route path="/biopsies/:id" element={<Biopsy {...this.props} />}/>
				<Route path="/analyse" element={<Analyse {...this.props}/>}/>
				{/* <Route path="/analyse/:id" element={<Analyse {...this.props}/>}/> */}
				<Route path="/logout" element={<Logout {...this.props}/>}/>
			</Routes>
		</BrowserRouter>;
	}
}

