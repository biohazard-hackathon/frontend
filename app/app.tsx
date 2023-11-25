import React, { FC, useEffect, useState } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';

import i18n from './locales';
import RootRouter from './router/RootRouter';
import store from './store/configureStore';

import { Navbar } from './components/Navbar';
import { authenticateUser } from './helpers';
import { Amplify } from 'aws-amplify';
import { AWS_REGION, USER_POOL_ID, USER_POOL_WEB_CLIENT_ID, HOSTED_UI_DOMAIN, REDIRECT_SIGN_IN, REDIRECT_SIGN_OUT } from './constants/env';

interface Props {}

const App: FC<Props> = (props) => {
	Amplify.configure({
		Auth: {
			region: AWS_REGION,
			userPoolId: USER_POOL_ID,
			userPoolWebClientId: USER_POOL_WEB_CLIENT_ID,
			mandatorySignIn: true,
			authenticationFlowType: 'USER_PASSWORD_AUTH',
			oauth: {
				domain: HOSTED_UI_DOMAIN,
				scope: [
					'openid',
					'aws.cognito.signin.user.admin',
					'email',
				],
				redirectSignIn: REDIRECT_SIGN_IN,
				redirectSignOut: REDIRECT_SIGN_OUT,
				responseType: 'code', // or 'token', note that REFRESH token will only be generated when the responseType is code
			},
		},
	});


	const [isSignedIn, setSignIn] = useState<boolean>(false);

	const userToken = localStorage.getItem('token');

	useEffect(() => {
		if (!userToken && !isSignedIn) {
			authenticateUser();
		}
	}, [isSignedIn]);

	return <React.StrictMode>
		<ReduxProvider store={store}>
			<I18nextProvider i18n={i18n}>
				<Navbar />
				<div className="container mt-2">
					<RootRouter {...props} />
				</div>
			</I18nextProvider>
		</ReduxProvider>
	</React.StrictMode>;
};

export default App;
