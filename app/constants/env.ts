const rootElement = document.getElementById('root');

export const PUBLIC_URL = rootElement?.getAttribute('data-public-url') ?? '';

export const VERSION = rootElement?.getAttribute('data-version') ?? '';

export const API_URL = rootElement?.getAttribute('api-url') ?? '';
export const AWS_REGION = 'us-east-1';
export const HOSTED_UI_DOMAIN = rootElement?.getAttribute('data-hosted-ui-domain') ?? '';
export const REDIRECT_SIGN_IN = rootElement?.getAttribute('data-redirect-sign-in') ?? '';
export const REDIRECT_SIGN_OUT = rootElement?.getAttribute('data-redirect-sign-out') ?? '';
export const USER_POOL_ID = rootElement?.getAttribute('data-user-pool-id') ?? '';
export const USER_POOL_WEB_CLIENT_ID = rootElement?.getAttribute('data-user-pool-web-client-id') ?? '';
