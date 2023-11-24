import React, { Component } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';

import i18n from './locales';
import RootRouter from './router/RootRouter';
import store from './store/configureStore';

interface Props {
}

interface State {
}

export default class App extends Component<Props, State> {
	render() {
		return <React.StrictMode>
			<ReduxProvider store={store}>
				<I18nextProvider i18n={i18n}>
					{<RootRouter {...this.props} />}
				</I18nextProvider>
			</ReduxProvider>
		</React.StrictMode>;
	}
}
