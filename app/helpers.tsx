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

export const authenticateUser = (user: IUserInfo | undefined, setSignIn: Function, setUser: Function) => {
	(async () => {
		try {
			const userInfo = await Auth.currentUserInfo() as IUserInfo;
			if (user) {
				const userData = await Auth.currentAuthenticatedUser();
				console.log('userData', userData);
				localStorage.setItem('token', userData?.signInUserSession.refreshToken.token)
				setSignIn(true);
				setUser(userInfo);
			} else {
				console.log('user not signed in');
				// await Auth.federatedSignIn();
			}
		} catch (error: unknown) {
			console.error(error);
			// todo redirect to error page
		}
	})();
}
