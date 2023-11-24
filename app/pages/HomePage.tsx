import React, {FC, useEffect, useState} from 'react';
import Icon from "../components/Icon";
import {useTranslation} from 'react-i18next';

interface Props {
}

export const HomePage: FC<Props> = ({}) => {
	const {t} = useTranslation();
	return <h1 className="text-center">
		<Icon name="biohazard" spin fixedWidth/>
		&nbsp;
		{t('title')}
	</h1>;
};


export default HomePage;
