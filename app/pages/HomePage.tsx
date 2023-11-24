import React, {FC, useEffect, useState} from 'react';
import Icon from "../components/Icon";
import {useTranslation} from 'react-i18next';
import {Auth} from 'aws-amplify';
import { IUserInfo } from '../types';

interface Props {
}

export const HomePage: FC<Props> = ({}) => {
	const [isSignedIn, setSignIn] = useState<boolean>(false);
	const [user, setUser] = useState<IUserInfo>();
	useEffect(() => {
		(async () => {
			try {
				const userInfo = await Auth.currentUserInfo() as IUserInfo;
				if (user) {
					setSignIn(true);
					setUser(userInfo);

				} else {
					console.log('user not signed in');
					await Auth.federatedSignIn();
				}
			} catch (error: unknown) {
				console.error(error);
				// todo redirect to error page
			}
		})();
	}, [isSignedIn]);

	const {t} = useTranslation();
	return <h1 className="text-center">
		<Icon name="biohazard" spin fixedWidth/>
		&nbsp;
		{t('title')}
	</h1>;
};


export default HomePage;
