import { Auth } from "aws-amplify";
import { IUserInfo } from "./types";

export const refreshToken = () => {
	(async () => {
		try {
			const currentSession = await Auth.currentSession();
			console.log('currentSession', currentSession);
		} catch (error) {
			console.error(error);
		}
	})();
}

export const authenticateUser = () => {
	(async () => {
		try {
			const userInfo = await Auth.currentUserInfo() as IUserInfo;

			if (userInfo) {
				const userData = await Auth.currentAuthenticatedUser();
				localStorage.setItem('token', userData?.signInUserSession.refreshToken.token)
			} else {
				console.log('user not signed in');
				await Auth.federatedSignIn();
			}
		} catch (error: unknown) {
			console.error(error);
			// todo redirect to error page
		}
	})();
}
