import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

const rootElement = document.getElementById('root');

if (rootElement !== null) {
	ReactDOM.render(<App/>, rootElement);
} else {
	throw new Error('No #root element');
}
