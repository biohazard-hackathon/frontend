import React, {FC, useEffect, useState} from 'react';
import Icon from "../components/Icon";
import {useTranslation} from 'react-i18next';
import BackendApi from '../api/BackendApi';
import {createUUID} from '../helpers';

interface Props {
}

export const HomePage: FC<Props> = ({}) => {
	async function handleUpload () {
		const uuid = createUUID();
		console.log(`Starting subscription for ${uuid}`);

		try {
			await BackendApi.onProgressUpdateSubscription(uuid);
		} catch (error) {
			console.log(error);
		}
	}


	const {t} = useTranslation();
	return <>
		<h1 className="text-center">
			<Icon name="biohazard" spin fixedWidth/>
			&nbsp;
			{t('title')}
		</h1>
		<button onClick={handleUpload}>Upload</button>
	</>;
};


export default HomePage;
