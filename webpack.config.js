/**
 * Copyright (c) 2013-2015 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/**
 * For an introduction to WebPack
 * @see https://github.com/petehunt/webpack-howto
 * @see http://slidedeck.io/unindented/webpack-presentation
 * @see http://christianalfoni.github.io/javascript/2014/12/13/did-you-know-webpack-and-react-is-awesome.html
 */

const path = require('path');
const deasync = require('deasync');
const webpack = require('webpack');
const cleanLessPlugin = require('./web_modules/less-plugin/index.es6');
const config = require('./webapp/config/index.es6');
const pkg = require('./package.json');

/**
 * This is really ugly but acceptable in devEnvironment !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * In a production environment, we need to load production.json from AWS S3 before we can export module
 * @type {boolean}
 */
let loaded = false;
config.load((error) => {
    if (error) {
        throw error;
    }
    loaded = true;
});
deasync.loopWhile(() => !loaded);
// Beware! config is not available until after deasync.loopWhile
const environment = config.environment || 'development';
const buildPath = config.get('uris:webpack:root');

console.log(`webpack environment is ${environment}`); // eslint-disable-line no-console
console.log(`webpack build path is ${buildPath}`); // eslint-disable-line no-console
console.log(`processing version ${pkg.version}`); // eslint-disable-line no-console

/**
 * DefinePlugin
 * definePlugin defines a global variable which is only available when running webpack
 * We use it to merge app.config.jsx with the proper
 * @type {webpack.DefinePlugin}
 * @see http://webpack.github.io/docs/list-of-plugins.html#defineplugin
 * @see https://github.com/petehunt/webpack-howto#6-feature-flags
 */
const definePlugin = new webpack.DefinePlugin({
    __NODE_ENV__: JSON.stringify(environment),
    __VERSION__: JSON.stringify(pkg.version),
});

/**
 * SourceMapDevToolPlugin builds source maps
 * For debugging in WebStorm see https://github.com/webpack/webpack/issues/238
 *
 * const sourceMapDevToolPlugin = new webpack.SourceMapDevToolPlugin(
 *     '[file].map', null,
 *     "[absolute-resource-path]", "[absolute-resource-path]"
 * );
 *
 * We are not using the source map plugin since webpack -d on the command line
 * produces sourcemaps in our development environment and we do not want sourcemaps in production.
 */

/**
 * BundleAnalyzerPlugin
 */
/*
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const bundleAnalyzerPlugin = new BundleAnalyzerPlugin({
    analyzerMode: 'static'
    // analyzerPort: 7000 <-- Fatal error: listen EADDRINUSE 127.0.0.1:7000
});
*/

/**
 * Webpack configuration
 * @see https://github.com/webpack/docs/wiki/configuration
 */
module.exports = {
    // All paths below are relative to the context
    context: path.join(__dirname, '/'),
    devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
    entry: {
        // ES5 application
        // app: ['./src/js/app.mobile.js'],
        // ES6 application
        app: ['./src/js/app/app.init.es6'],
        // Worker library
        // workerlib: './src/js//kidoju.data.workerlib.js'
    },
    externals: {
        // CDN modules
        jquery: 'jQuery',
    },
    module: {
        rules: [
            {
                test: /\.es6$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: { babelrc: true },
                    },
                ],
            },
            {
                // Do not put a $ at the end of the test regex
                test: /\.jsx/, // see ./web_modules/jsx-loader
                use: [
                    {
                        loader: './web_modules/jsx-loader/index.es6',
                        options: { config: 'webapp/config' },
                    },
                ],
            },
            {
                test: /app\.theme\.[a-z0-9-]+\.less$/,
                use: [
                    {
                        loader: 'bundle-loader',
                        options: { name: '[name]' },
                    },
                    { loader: 'style-loader/useable' },
                    {
                        loader: 'css-loader',
                        options: { importLoaders: 2 },
                    },
                    { loader: 'postcss-loader' },
                    // See https://github.com/jlchereau/Kidoju-Webapp/issues/197
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                compress: true,
                                relativeUrls: true,
                                strictMath: true,
                                plugins: [cleanLessPlugin],
                            },
                        },
                    },
                ],
            },
            {
                test: /\.less$/,
                exclude: /app\.theme\.[a-z0-9-]+\.less$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: { importLoaders: 1 },
                    },
                    { loader: 'postcss-loader' },
                    // See https://github.com/jlchereau/Kidoju-Webapp/issues/197
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                compress: true,
                                relativeUrls: true,
                                strictMath: true,
                                plugins: [cleanLessPlugin],
                            },
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: { importLoaders: 1 },
                    },
                    { loader: 'postcss-loader' },
                ],
            },
            {
                test: /\.(gif|png|jpe?g)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: { limit: 8192 },
                    },
                ],
            },
            {
                test: /\.woff(2)?/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            mimetype: 'application/font-woff',
                        },
                    },
                ],
            },
            {
                test: /\.(ttf|eot|svg)/,
                use: [{ loader: 'file-loader' }],
            },
        ],
    },
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    optimization: {
        minimize: process.env.NODE_ENV === 'production',
    },
    output: {
        // Unfortunately it is not possible to specialize output directories
        // See https://github.com/webpack/webpack/issues/882
        path: path.join(__dirname, '/www/build'),
        publicPath: buildPath,
        filename: `[name].bundle.js?v=${pkg.version}`,
        chunkFilename: `[name].bundle.js?v=${pkg.version}`,
    },
    plugins: [
        definePlugin,
        // bundleAnalyzerPlugin
    ],
    resolve: {
        modules: [
            path.resolve(__dirname, 'src/js/vendor/kendo'), // required since Kendo UI 2016.1.112
            'node_modules',
        ],
    },
};
