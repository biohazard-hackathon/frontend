import { Amplify } from "aws-amplify";
import { AWS_REGION, USER_POOL_ID, USER_POOL_WEB_CLIENT_ID, HOSTED_UI_DOMAIN, REDIRECT_SIGN_IN, REDIRECT_SIGN_OUT } from "./env";

export const configureAmplitude = () => {
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
}
