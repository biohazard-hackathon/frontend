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
};

export const authenticateUser = (user: IUserInfo | undefined, setSignIn: Function, setUser: Function) => {
	(async () => {
		try {
			const userInfo = await Auth.currentUserInfo() as IUserInfo;
			if (user) {
				const userData = await Auth.currentAuthenticatedUser();
				console.log('userData', userData);
				localStorage.setItem('token', userData?.signInUserSession.refreshToken.token);
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
};
export const createUUID = () => {
    // http://www.ietf.org/rfc/rfc4122.txt
    const uuid = [];
    const hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
        uuid[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    uuid[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
	uuid[19] = hexDigits.substr((uuid[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";

    return uuid.join("");
};
