/**
 * Copyright (c) 2013-2015 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint node: true */

'use strict';

// For an introduction to WebPack see
// https://github.com/petehunt/webpack-howto
// http://slidedeck.io/unindented/webpack-presentation
// http://christianalfoni.github.io/javascript/2014/12/13/did-you-know-webpack-and-react-is-awesome.html

var path = require('path');
var util = require('util');
var webpack = require('webpack');


/**
 * definePlugin defines a global variable which is only available when running webpack
 * We use it to merge app.config.jsx with the proper
 * @type {webpack.DefinePlugin}
 * @see http://webpack.github.io/docs/list-of-plugins.html#defineplugin
 * @see https://github.com/petehunt/webpack-howto#6-feature-flags
 */
var pkg = require('./package.json');
var definePlugin = new webpack.DefinePlugin({
    __VERSION__: JSON.stringify(pkg.version)
});
console.log('building version ' + pkg.version);

/**
 * dedupePlugin for improved optimization
 * see grunt-webpack in gruntfile.js
 *
 * var dedupePlugin = new webpack.optimize.DedupePlugin();
 */

/**
 * Add banner at the top of every bundle/chunk
 */
var bannerPlugin =
    new webpack.BannerPlugin(pkg.copyright + ' - Version ' + pkg.version + ' dated ' + (new Date()).toLocaleDateString());

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
 * Webpack configuration
 * @see https://github.com/webpack/docs/wiki/configuration
 */
module.exports = {
    // All paths below are relative to the context
    context: path.join(__dirname, '/'),
    devtool: 'source-map',
    entry: {
        // We need init especially because of FOUJI
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
        // publicPath: config.get('uris:webpack:root'),
        filename: '[name].bundle.js?v=' + pkg.version,
        chunkFilename: '[name].chunk.js?v=' + pkg.version
    },
    resolve: {
        // moduleDirectories: ['web_modules', 'node_modules'], this is default
        root: path.resolve('.'),
        // required since Kendo UI 2016.1.112
        fallback: path.resolve('./js/vendor/kendo')
    },
    module: {
        loaders: [
            /*
            {
                // Do not put a $ at the end of the test regex
                test: /\.jsx/, // see ./web_modules/jsx-loader
                loader: 'jsx?config=webapp/config'
            },
            */
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /app\.theme\.[a-z0-9]+\.less$/,
                loader: 'bundle?name=[name]!style/useable!css!less'
            },
            {
                test: /\.less$/,
                exclude: /app\.theme\.[a-z0-9]+\.less$/,
                loader: 'style!css!less'
            },
            {
                test: /\.css$/,
                loader: 'style!css'
            },
            {
                test: /\.(gif|png|jpe?g)$/,
                loader: 'url?limit=8192'
            },
            {
                // test: /\.woff(2)?(\?v=[0-9]\.[0-9](\.[0-9])?)?$/,
                test: /\.woff(2)?/,
                loader: 'url?limit=10000&mimetype=application/font-woff'
            },
            {
                // test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9](\.[0-9])?)?$/,
                test: /\.(ttf|eot|svg)/,
                loader: 'file'
            }
        ]
    },
    plugins: [
        definePlugin,
        // dedupePlugin,
        bannerPlugin
        // sourceMapDevToolPlugin
    ]
};
