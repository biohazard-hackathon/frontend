import React, { Component } from 'react';
import Icon from '../components/Icon';
//@ts-ignore
import icons from '../../temp/icons/icons.json';

interface Props {
	readonly type: string,
}

interface State {
}

export default class IconDocs extends Component<Props, State> {
	render() {
		const { type } = this.props;

		return <div className="row text-center mb-4">
			{icons[type].map((name: string) => this.renderIcon(name))}
		</div>;
	}

	private renderIcon(name: string) {
		return <div key={name} className="col-xs-6 col-sm-4 col-lg-3">
			<div className="docs__icon">
				<Icon name={name}/>
				<p>
					<code>{name}</code>
				</p>
			</div>
		</div>;
	}
}
