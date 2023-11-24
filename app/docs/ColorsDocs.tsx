import React, { Component } from 'react';

const colors = {
	brand: [
		'primary',
		'secondary',
		//'tertiary',
	],
	system: [
		'info',
		'success',
		'warning',
		'danger',
	],
};

interface Props {
	type: string,
}

interface State {
}

export default class ColorsDocs extends Component<Props, State> {
	render() {
		const { type } = this.props;
		//@ts-ignore
		const colorList = colors[type];

		return <div className="row text-center">
			{colorList.map((color: string) => ColorsDocs.renderColor(type, color))}
		</div>;
	}

	private static renderColor(type: string, color: string) {
		return <div key={type + color} className="col-xs-6 col-sm-4 col-lg-3">
			<div className={'docs__color-box color-' + type + '-' + color}/>
			<p>
				<code>.color-{type}-{color}</code>
			</p>
		</div>;
	}
}
