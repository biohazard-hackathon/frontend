import { Gulpclass, SequenceTask } from 'gulpclass';
import gulp, { TaskFunction } from 'gulp';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import rename from 'gulp-rename';
import mergeStream from 'merge-stream';
import yargs from 'yargs';
import svgmin from 'gulp-svgmin';
import * as fs from 'fs';
import glob from 'glob';
import YAML from 'yaml';
import browserSyncModule from 'browser-sync';
//@ts-ignore
import clean from 'gulp-clean';

// @ts-ignore
import sassVars from 'gulp-sass-vars';
// @ts-ignore
import consolidate from 'gulp-consolidate';
// @ts-ignore
import iconfont from 'gulp-iconfont';
//@ts-ignore
import template from 'gulp-template';
//@ts-ignore
import webpackCompiler from 'webpack';
//@ts-ignore
import webpack from 'webpack-stream';
//@ts-ignore
import historyApiFallback from 'connect-history-api-fallback';
//@ts-ignore
import gulpHtmlmin from 'gulp-htmlmin';
//@ts-ignore
import named from 'vinyl-named';
//@ts-ignore
import run from 'gulp-run';
//@ts-ignore
import zip from 'gulp-zip';
import sassModule from 'sass';
import gulpSassModule from 'gulp-sass';

// @ts-ignore
const browserSync = browserSyncModule.create();

// @ts-ignore
const gulpSass = gulpSassModule(sassModule);

// @ts-ignore
import webpackConfig from './webpack.config.js';

const config = fs.readFileSync('./config.yml', 'utf8');

let port = 8081;
let development = false;

const getVersion = () => {
	let version = '@dev';

	//@ts-ignore
	if (typeof (yargs.argv.appVersion) !== 'undefined') {
		//@ts-ignore
		version = (yargs.argv.appVersion as string).replace('v', '');
	}

	return version;
};

const appVersion = getVersion();

const sass = () => {
	return gulp.src('scss/style-*.scss')
		.pipe(sassVars({
			appVersion,
		}, { verbose: true }))
		.pipe(gulpSass().on('error', gulpSass.logError))
		.pipe(gulp.dest('www/css'))
		.pipe(browserSync.stream());
};

const cssmin = () => {
	return gulp.src(['www/css/*.css', '!www/css/*.min.css'])
		.pipe(postcss([
			autoprefixer(),
			cssnano,
		]))
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('www/css'));
};

const css = gulp.series(sass, cssmin);

const htmlmin = () => {
	let stream = gulp.src([
		'index.html',
	]);

	if (development) {
		stream = stream.pipe(template({
			VERSION: appVersion,
			...YAML.parse(config),
		}));
	}

	return stream.pipe(gulpHtmlmin({
		collapseWhitespace: true,
	})).pipe(gulp.dest('www'));
};

// Documentation
const storybook = () => run('npm run storybook').exec();

const transpile = () => {
	let myConfig = { ...webpackConfig };
	//@ts-ignore
	myConfig.plugins = myConfig.plugins.concat([
		new webpackCompiler.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(development ? 'development' : 'production'),
			'process.env.BROWSERSLIST_DISABLE_CACHE': true,
		}),
		new webpackCompiler.ProvidePlugin({
			process: 'process/browser',
		}),
	]);

	if (!development) {
		//@ts-ignore
		myConfig.optimization.minimize = true;
		//@ts-ignore
		myConfig.mode = 'production';
	}

	return gulp.src(['app/app-*.{js,jsx,ts,tsx}'])
		.pipe(named())
		.pipe(webpack(myConfig, webpackCompiler))
		.on('error', function(err: any) {
			console.error('WEBPACK ERROR', err);
			// @ts-ignore
			this.emit('end'); // Don't stop the rest of the task
		})
		.pipe(gulp.dest('www/js'))
		.pipe(browserSync.stream());
};

const js = gulp.series(transpile);

const server = () => {
	return browserSync.init({
		open: false,
		port: port,
		//https: true,
		server: {
			baseDir: 'www',
			middleware: [
				historyApiFallback(),
			],
		},
	});
};

const iconFont = () => {
	const fontName = 'icons';
	const runTimestamp = Math.round(Date.now() / 1000);
	const streams = mergeStream();
	const iconPath = 'temp/icons/';
	const iconPathGlob = `${iconPath}**/*.svg`;

	glob(iconPathGlob, {}, function(eror, files) {
		const iconStructure: Record<string, Array<string>> = {};
		for (const file of files) {
			const [group, name] = file.replace(iconPath, '').replace('.svg', '').split('/');

			if (!name) {
				continue;
			}

			if (Object.keys(iconStructure).includes(group)) {
				iconStructure[group].push(name);
			} else {
				iconStructure[group] = [String(name)];
			}
		}

		fs.writeFileSync(`${iconPath}/icons.json`, JSON.stringify(iconStructure));
	});

	const svgStream = gulp.src([iconPathGlob])
		.pipe(iconfont({
			fontName: fontName,
			prependUnicode: true,
			//round: 10e6,
			timestamp: runTimestamp,
			formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'],
			normalize: true,
			fontHeight: 1000,
		}))
		.on('glyphs', function(glyphs: Array<Record<string, string>>) {
			const templateStream = gulp.src('scss/global/partials/_icons.scss.erb')
				.pipe(consolidate('lodash', {
					glyphs: glyphs,
					fontName: fontName,
					fontPath: '../fonts/icons/',
					className: 'icon',
					version: appVersion,
				}))
				//@ts-ignore
				.pipe(rename(function(iconPath: Record<string, string>) {
					iconPath.basename = fontName;
					iconPath.extname = '.scss';
				})).pipe(gulp.dest('temp/css/'));

			streams.add(templateStream);
		}).pipe(gulp.dest('www/fonts/icons'));

	streams.add(svgStream);

	return streams;
};

const cleanSvg = () => {
	return gulp.src('temp/icons/**/*.svg')
		.pipe(clean());

};

const optimizeSvg = () => {
	return gulp.src('icons/**/*.svg')
		.pipe(svgmin({
			plugins: [{
				convertPathData: {
					noSpaceAfterFlags: false,
				},
			}],
		}))
		.pipe(gulp.dest('temp/icons'));
};

const icons = gulp.series(cleanSvg, optimizeSvg, iconFont);

const watch = () => {
	const watchConfig = {
		interval: 500,
		usePolling: true,
	};
	const scss = gulp.watch(['scss/**/*.scss'], watchConfig, gulp.series(css));
	const svg = gulp.watch(['icons/**/*.svg'], watchConfig, gulp.series(icons, css));
	const html = gulp.watch(['*.html'], watchConfig, htmlmin);
	const javascript = gulp.watch(['app/**/*.{js,jsx,ts,tsx,json}'], watchConfig, js);

	return Promise.all([scss, svg, html, javascript]);
};

const buildZip = () => {
	return gulp.src('release/build/**/*')
		.pipe(zip('frontend.zip'))
		.pipe(gulp.dest('release/target/'));
};

const build = gulp.series(
	gulp.parallel(
		gulp.series(icons, css),
		js,
		htmlmin,
	),
);

const setDev = (done: CallableFunction) => {
	development = true;
	done();
};


@Gulpclass()
export class Gulpfile {
	@SequenceTask()
	build(): Array<TaskFunction> {
		return [
			build,
		];
	}

	@SequenceTask()
	package(): Array<TaskFunction> {
		return [
			buildZip,
		];
	}

	@SequenceTask('default')
	defaultTask(): Array<TaskFunction | string> {
		return [
			setDev,
			build,
			//@ts-ignore
			gulp.parallel(watch, server, storybook),
		];
	}
}
