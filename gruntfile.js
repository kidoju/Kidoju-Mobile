/**
 * Copyright (c) 2013-2016 Memba Sarl. All rights reserved.
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
            jquery: {
                src: './js/vendor/jQuery/jquery-2.2.4.min.js',
                dest: './www/build/jquery.min.js'
            },
            workerlib: {
                src: './webapp/public/build/workerlib.bundle.js',
                dest: './www/build/workerlib.bundle.js'
            }
        },
        jscs: {
            files: ['gruntfile.js', 'webpack.config.js', 'js/**/app.*.js', 'js/**/*.jsx', 'webapp/**/*.js', 'test/**/*.js'],
            options: {
                config: '.jscsrc',
                excludeFiles: ['js/kidoju.*.js', 'js/vendor/**/*.js', 'webapp/public/**/*.js', 'test/vendor/**/*.js']
            }
        },
        jshint: {
            all: ['gruntfile.js', 'webpack.config.js', 'js/**/app.*.js', 'js/**/*.jsx', 'webapp/**/*.js', 'test/**/*.js'],
            ignores: ['js/kidoju.*.js', 'js/vendor/**/*.js', 'webapp/public/**/*.js', 'test/vendor/**/*.js'],
            options: {
                jshintrc: true
            }
        },
        // TODO karma
        /*
        kendo_lint: {
            files: ['src/js/app*.js']
        },
        */
        // TODO: lint html too
        mocha: {
            browser: { // In browser (phantomJS) unit tests
                options: {
                    log: true,
                    logErrors: true,
                    reporter: 'Spec',
                    run: true,
                    timeout: 5000
                },
                src: ['test/browser/**/*.html']
            }
        },
        mochaTest: { // In node (Zombie) unit tests
            node: {
                options: {
                    quiet: false,
                    reporter: 'spec',
                    timeout: 10000,
                    ui: 'bdd'
                },
                src: ['test/node/**/*.js']
            }
        },
        uglify: {
            build: {
                options: {
                    banner: '/*! <%= pkg.copyright %> - Version <%= pkg.version %> dated <%= grunt.template.today() %> */',
                    sourceMap: true,
                    sourceMapName: 'webapp/public/build/workerlib.bundle.js.map'
                },
                files: {
                    'webapp/public/build/workerlib.bundle.js': ['js/kidoju.data.workerlib.js']
                }
            }
        },
        webdriver: { // Selenium functional tests
            local: {
                configFile: './wdio.conf.js'
            }
        },
        webpack: {
            // @see https://github.com/webpack/webpack-with-common-libs/blob/master/Gruntfile.js
            options: webpackConfig,
            build: {
                cache: false,
                plugins: webpackConfig.plugins.concat(
                    new webpack.optimize.DedupePlugin(),
                    new webpack.optimize.UglifyJsPlugin()
                    // new webpack.optimize.AggressiveMergingPlugin() // Note: merges app.culture.fr.chunk.js
                )
            }
        }
    });

    // Lint
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    // grunt.loadNpmTasks('grunt-kendo-lint');

    // Build
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Tests
    grunt.loadNpmTasks('grunt-mocha');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-webdriver');

    // Commands
    grunt.registerTask('lint', ['jscs', 'jshint', 'kendo_lint']);
    grunt.registerTask('build', ['webpack:build', 'uglify:build', 'copy']);
    grunt.registerTask('test', ['mocha', 'mochaTest', 'webdriver']);
    grunt.registerTask('default', ['lint', 'build', 'test']);

};
