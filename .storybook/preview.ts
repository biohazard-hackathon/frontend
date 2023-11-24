//@ts-ignore
import i18n from '../app/locales';

export const parameters = {
	i18n,
	viewMode: 'docs',
	actions: { argTypesRegex: "^on[A-Z].*" },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
}
