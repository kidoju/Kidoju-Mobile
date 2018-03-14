/**
 * Copyright (c) 2013-2015 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint node: true */

'use strict';

/**
 * For an introduction to WebPack
 * @see https://github.com/petehunt/webpack-howto
 * @see http://slidedeck.io/unindented/webpack-presentation
 * @see http://christianalfoni.github.io/javascript/2014/12/13/did-you-know-webpack-and-react-is-awesome.html
 */

var path = require('path');
var util = require('util');
var deasync = require('deasync');
var webpack = require('webpack');
var config = require('./webapp/config');
var cleanPlugin = require('./web_modules/less-plugin');

/**
 * This is really ugly but acceptable in devEnvironment !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * In a production environment, we need to load production.json from AWS S3 before we can export module
 * @type {boolean}
 */
var loaded = false;
config.load(function (error /*.store*/) {
    if (error) {
        throw error;
    }
    loaded = true;
});
deasync.loopWhile(function () { return !loaded; });

var pkg = require('./package.json');
var environment = config.environment || 'development';

console.log('webpack environment is ' + environment);
console.log('webpack public path is ' + config.get('uris:webpack:root'));
console.log('building version ' + pkg.version);

/**
 * DefinePlugin
 * definePlugin defines a global variable which is only available when running webpack
 * We use it to merge app.config.jsx with the proper
 * @type {webpack.DefinePlugin}
 * @see http://webpack.github.io/docs/list-of-plugins.html#defineplugin
 * @see https://github.com/petehunt/webpack-howto#6-feature-flags
 */
var definePlugin = new webpack.DefinePlugin({
    __NODE_ENV__: JSON.stringify(environment),
    __VERSION__: JSON.stringify(pkg.version)
});

/**
 * SourceMapDevToolPlugin builds source maps
 * For debugging in WebStorm see https://github.com/webpack/webpack/issues/238
 *
 * var sourceMapDevToolPlugin = new webpack.SourceMapDevToolPlugin(
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
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var bundleAnalyzerPlugin = new BundleAnalyzerPlugin({
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
    devtool: 'sourcemap',
    entry: {
        app: './js/app.mobile.js' // ,
        // Worker library
        // workerlib: './js/kidoju.data.workerlib.js'
    },
    externals: { // CDN modules
        jquery: 'jQuery'
    },
    output: {
        // Unfortunately it is not possible to specialize output directories
        // See https://github.com/webpack/webpack/issues/882
        path: path.join(__dirname, '/www/build'),
        publicPath: config.get('uris:webpack:root'),
        filename: '[name].bundle.js?v=' + pkg.version,
        chunkFilename: '[name].chunk.js?v=' + pkg.version
    },
    resolve: {
        modules: [
            path.resolve('.'),
            path.resolve('./js/vendor/kendo'), // required since Kendo UI 2016.1.112
            'node_modules'
        ]
    },
    module: {
        rules: [
            {
                // Do not put a $ at the end of the test regex
                test: /\.jsx/, // see ./web_modules/jsx-loader
                use: [
                    { loader: './web_modules/jsx-loader', options: { config: 'webapp/config' } }
                ]
            },
            {
                test: /app\.theme\.[a-z0-9\-]+\.less$/,
                use: [
                    { loader: 'bundle-loader', options: { name: '[name]', lazy: true } }, // { loader: 'bundle-loader?name=[name]' },
                    { loader: 'style-loader/useable' },
                    { loader: 'css-loader', options: { importLoaders: 2 } },
                    { loader: 'postcss-loader' },
                    // See https://github.com/jlchereau/Kidoju-Webapp/issues/197
                    { loader: 'less-loader', options: { compress: true, relativeUrls: true, strictMath: true, plugins: [cleanPlugin] } }
                ]
            },
            {
                test: /\.less$/,
                exclude: /app\.theme\.[a-z0-9\-]+\.less$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    { loader: 'postcss-loader' },
                    // See https://github.com/jlchereau/Kidoju-Webapp/issues/197
                    { loader: 'less-loader', options: { compress: true, relativeUrls: true, strictMath: true, plugins: [cleanPlugin] } }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    { loader: 'postcss-loader' }
                ]
            },
            {
                test: /\.(gif|png|jpe?g)$/,
                use: [
                    { loader: 'url-loader', options: { limit: 8192 } }
                ]
            },
            {
                test: /\.woff(2)?/,
                use: [
                    { loader: 'url-loader', options: { limit: 10000, mimetype: 'application/font-woff' } }
                ]
            },
            {
                test: /\.(ttf|eot|svg)/,
                use: [
                    { loader: 'file-loader' }
                ]
            }
        ]
    },
    plugins: [
        definePlugin
        // bundleAnalyzerPlugin
    ]
};
