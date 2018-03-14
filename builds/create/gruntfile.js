/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba/Kidoju-Platform
 */

/* jslint node: true */
/* jshint node: true */

/* And because of kendo_lint */
/* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */

'use strict';

module.exports = function (grunt) {

    /**
     * Unfortunately, we cannot use grunt-env to set the environment
     * - webpack uses a DefinePlugin which reads process.env.NODE_ENV
     * - nconf reads process.env.NODE_ENV
     * Both read the environment variable before grunt-env can set it in the grunt process.
     * So we have not other way than to actually set NODE_ENV in the OS to produce a build
     * especially set NODE_ENV=production for a production build.
     */

    if (process.env.NODE_ENV) {
        console.log('grunt environment is ' + process.env.NODE_ENV);
    } else {
        console.log('IMPORTANT: grunt environment is undefined. Use the `build.cmd` script');
    }

    var webpack = require('webpack');
    var webpackConfig = require(__dirname + '/webpack.config.js');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            options: {
                processContentExclude: ['**/*.js']
            },
            bluebird: {
                src: './js/vendor/bluebird/bluebird.core.min.js',
                dest: './www/build/bluebird.core.min.js'
            },
            jquery: {
                src: './js/vendor/jquery/jquery-3.3.1.min.js',
                dest: './www/build/jquery.min.js'
            },
            workerlib: {
                src: './webapp/public/build/workerlib.bundle.js',
                dest: './www/build/workerlib.bundle.js'
            }
        },
        uglify: {
            build: {
                options: {
                    banner: '/*! <%= pkg.copyright %> - Version <%= pkg.version %> dated <%= grunt.template.today() %> */',
                    sourceMap: false
                    // sourceMap: true,
                    // sourceMapName: 'webapp/public/build/workerlib.bundle.js.map'
                },
                files: {
                    'webapp/public/build/workerlib.bundle.js': ['js/kidoju.data.workerlib.js']
                }
            }
        },
        webpack: {
            // @see https://github.com/webpack/webpack-with-common-libs/blob/master/Gruntfile.js
            options: webpackConfig,
            build: {
                cache: false,
                devtool: false,
                plugins: webpackConfig.plugins.concat(
                    new webpack.optimize.UglifyJsPlugin({
                        // banner: '/*! <%= pkg.copyright %> - Version <%= pkg.version %> dated <%= grunt.template.today() %> */',
                        comments: false,
                        compress: {
                            screw_ie8: true,
                            warnings: false
                        },
                        sourceMap: false
                    }),
                    new webpack.BannerPlugin({
                        banner: '/*! <%= pkg.copyright %> - Version <%= pkg.version %> dated <%= grunt.template.today() %> */',
                        raw: true
                        // entryOnly: true
                    })
                )
            }
        }
    });

    // Load npm tasks
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-webpack');


    // Commands
    grunt.registerTask('build', ['webpack:build', 'uglify:build', 'copy']);

};
