import type {StorybookConfig} from '@storybook/react/types'
import {Configuration} from 'webpack';
//@ts-ignore
import * as webpackConfig from '../webpack.config.js';

const config: StorybookConfig = {
	stories: [
		"../docs/**/*.story.mdx",
		"../docs/**/*.@(js|jsx|ts|tsx)",
	],
	staticDirs: [
		{
			from: "../www/css",
			to: '/css',
		},
		{
			from: "../www/images",
			to: '/images',
		},
		{
			from: "../www/fonts",
			to: '/fonts',
		}
	],
	//logLevel: 'debug',
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
		'storybook-react-i18next',
	],
	framework: "@storybook/react",
	typescript: {
		check: true,
		checkOptions: {},
	},
	features: {
		postcss: false,
	},
	core: {
		builder: 'webpack5',
		channelOptions: {
			allowFunction: false,
			maxDepth: 10,
		},
	},
	webpackFinal: async (config: Configuration, {configType}) => {
		config.watch = true
		config.watchOptions = {
			aggregateTimeout: 600,
			poll: 1000,
			ignored: /node_modules/,
		}

		//@ts-ignore
		config.module.rules = [
			//@ts-ignore
			...config.module?.rules,
			...webpackConfig.module.rules,
		];

		return config
	},
}

module.exports = config
