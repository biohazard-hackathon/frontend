import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

//@ts-ignore
import enCommonLocales from './en/common.json';

export const en = {
	common: enCommonLocales,
};

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

i18n
	.use(LanguageDetector)
	.init({
		fallbackLng: 'en',

		react: {
			// wait: true, // globally set to wait for loaded translations in translate hoc
			// exposeNamespace: true, // exposes namespace on data-i18next-options to be used in eg. locize-editor
		},

		// have a common namespace used around the full app
		ns: ['common'],
		defaultNS: 'common',

		debug: !isProduction && !isTest,

		resources: {
			en: en,
		},

		interpolation: {
			escapeValue: false, // not needed for react!!
			formatSeparator: ',',
			format: function(value, format/*, lng*/) {
				if (format === 'uppercase') {
					return value.toUpperCase();
				}
				return value;
			},
		},
	});

export default i18n;
