import { Auth } from "aws-amplify";
import React, { useEffect } from "react";

import { IUserInfo } from "../types";

export const Logout = () => {
	useEffect(() => {
		(async () => {
			try {
				const userInfo = await Auth.currentUserInfo() as IUserInfo;
				if (userInfo) {
					await Auth.signOut();
				} else {
					console.log('user not signed in');
				}
			} catch (error: unknown) {
				console.error(error);
				// todo redirect to error page
			}
		})();

	}, []);

	return (
		<h1>Logout</h1>
	)
}
