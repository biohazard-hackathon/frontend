const rootElement = document.getElementById('root');

function resolveApiUrl(external = process.env.API_URL): string {
	if (external) {
		return external;
	}

	if (rootElement) {
		return rootElement.getAttribute('data-api-url') || '';
	}

	return '';
}

export const PUBLIC_URL: string = rootElement ? rootElement.getAttribute('data-public-url') || '' : '';

export const VERSION: string = rootElement ? rootElement.getAttribute('data-version') || '' : '';

export const API_URL: string = resolveApiUrl();

export const AWS_REGION = '';
export const HOSTED_UI_DOMAIN = '';
export const REDIRECT_SIGN_IN = '';
export const REDIRECT_SIGN_OUT = '';
export const USER_POOL_ID = '';
export const USER_POOL_WEB_CLIENT_ID = '';
