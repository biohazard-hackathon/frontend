import { Auth } from "aws-amplify";
import React, { FC, useEffect } from "react";

import { IUserInfo } from "../types";
interface Props {}
export const Logout: FC<Props> = () => {
	useEffect(() => {
		(async () => {
			try {
				const userInfo = await Auth.currentUserInfo() as IUserInfo;
				if (userInfo) {
					await Auth.signOut();
					localStorage.removeItem('token');
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
