import React, {Component} from 'react';
import {withTranslation, WithTranslation} from "react-i18next";
import withRouter, {WithRouter} from "../wrappers/ReactRouter";
import Icon from "../components/Icon";

interface Props extends WithTranslation, WithRouter {
}

interface State {
}

class HomePage extends Component<Props, State> {
	render() {
		const {t} = this.props;

		return <h1 className="text-center">
			<Icon name="biohazard" spin fixedWidth/>
			&nbsp;
			{t('title')}
		</h1>;
	}
}

export default (withTranslation()(withRouter(HomePage)));
