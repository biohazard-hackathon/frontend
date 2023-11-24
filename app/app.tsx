import React, { FC, useEffect, useState } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';

import i18n from './locales';
import RootRouter from './router/RootRouter';
import store from './store/configureStore';

import { Amplify, Auth } from 'aws-amplify';
import { Navbar } from './components/Navbar';
import { IUserInfo } from './types';
import { configureAmplitude } from './constants/config';
import { authenticateUser, refreshToken } from './helpers';

const App: FC = (props) => {
	configureAmplitude();

	const [isSignedIn, setSignIn] = useState<boolean>(false);
	const [user, setUser] = useState<IUserInfo>();

	const userToken = localStorage.getItem('token')

	useEffect(() => {
		console.log('userToken', userToken)
		if (!userToken) {
			refreshToken();
			if (!user) {
				authenticateUser(user, setSignIn, setUser);
			}

		}
	}, [isSignedIn]);

	return <React.StrictMode>
		<ReduxProvider store={store}>
			<I18nextProvider i18n={i18n}>
				<Navbar />
				<div className="container mt-5">
					<RootRouter {...props} />
				</div>
			</I18nextProvider>
		</ReduxProvider>
	</React.StrictMode>;
};

export default App;
