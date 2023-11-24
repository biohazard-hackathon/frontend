import React, {FC} from 'react';
import {Provider as ReduxProvider} from 'react-redux';
import {I18nextProvider} from 'react-i18next';

import i18n from './locales';
import RootRouter from './router/RootRouter';
import store from './store/configureStore';

import {Amplify} from 'aws-amplify';
import {
	AWS_REGION,
	HOSTED_UI_DOMAIN,
	REDIRECT_SIGN_IN,
	REDIRECT_SIGN_OUT,
	USER_POOL_ID,
	USER_POOL_WEB_CLIENT_ID,
} from './constants/env';

interface Props {
}

interface State {
}
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
					'email',
				],
				redirectSignIn: REDIRECT_SIGN_IN,
				redirectSignOut: REDIRECT_SIGN_OUT,
				responseType: 'code', // or 'token', note that REFRESH token will only be generated when the responseType is code
			},
		},
	});
	return <React.StrictMode>
		<ReduxProvider store={store}>
			<I18nextProvider i18n={i18n}>
				{<RootRouter {...props} />}
			</I18nextProvider>
		</ReduxProvider>
	</React.StrictMode>;
};

export default App;
