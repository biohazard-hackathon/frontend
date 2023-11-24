import React, { Component } from 'react';

interface Props {
	readonly name: string,
	readonly pulse?: boolean,
	readonly spin?: boolean,
	readonly fixedWidth?: boolean,
	readonly size?: string,
	readonly className?: string,
	readonly title?: string,
}

interface State {
}

class Icon extends Component<Props, State> {
	static defaultProps = {
		pulse: false,
		spin: false,
		fixedWidth: false,
		size: null,
		className: '',
	};

	render() {
		const { name, pulse, spin, fixedWidth, size, className, ...rest } = this.props;

		let classes = `icon icon--${name}`;

		if (pulse) {
			classes += ' icon--pulse';
		} else if (spin) {
			classes += ' icon--spin';
		}

		if (fixedWidth) {
			classes += ' icon--fw';
		}

		if (size) {
			classes += ` icon--${size}`;
		}

		if (className) {
			classes += ' ' + className;
		}

		return <i className={classes} {...rest} />;
	}
}

export default Icon;
