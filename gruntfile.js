/**
 * Copyright (c) 2019-2021 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba/Kidoju-Platform
 */

/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

module.exports = (grunt) => {
    /**
     * Unfortunately, we cannot use grunt-env to set the environment
     * - webpack uses a DefinePlugin which reads process.env.NODE_ENV
     * - nconf reads process.env.NODE_ENV
     * Both read the environment variable before grunt-env can set it in the grunt process.
     * So we have not other way than to actually set NODE_ENV in the OS to produce a build
     * especially set NODE_ENV=production for a production build.
     */

    if (process.env.NODE_ENV) {
        // eslint-disable-next-line no-console
        console.log(`grunt environment is ${process.env.NODE_ENV}`);
    } else {
        // eslint-disable-next-line no-console
        console.log('IMPORTANT: grunt environment is undefined');
    }

    const pkg = grunt.file.readJSON('package.json');
    const banner = `/*! ${pkg.copyright} - Version ${
        pkg.version
    } dated ${grunt.template.today('dd-mmm-yyyy')} */`;
    // console.log(banner);

    grunt.initConfig({
        pkg,
        concat: {
            options: {},
            dist: {
                src: [
                    'www/views/_head.html',
                    'www/views/notification.html',
                    'www/views/layout.html',
                    'www/views/drawer.html',
                    'www/views/error.html', // <--------- First view = default
                    'www/views/activities.html',
                    'www/views/categories.html',
                    'www/views/correction.html',
                    'www/views/favourites.html',
                    'www/views/finder.html',
                    'www/views/network.html',
                    'www/views/player.html',
                    // 'www/views/ratings.html',
                    'www/views/score.html',
                    'www/views/settings.html',
                    'www/views/signin.html',
                    'www/views/summary.html',
                    'www/views/sync.html',
                    'www/views/user.html',
                    'www/views/_foot.html',
                ],
                dest: 'www/index.html',
            },
        },
        copy: {
            options: {
                processContentExclude: ['**/*.js'],
            },
            jquery: {
                src: './src/js/vendor/jquery/jquery-3.6.0.min.js',
                dest: './www/build/jquery.min.js',
            },
            workerlib: {
                src: './webapp/public/build/workerlib.bundle.js',
                dest: './www/build/workerlib.bundle.js',
            },
        },
        eslint: {
            files: ['*.js', './hooks/*.js', './js/**/*.es6'],
            options: {
                config: '.eslintrc',
            },
        },
        // jscs: {
        //     files: [
        //         'js/**/app.*.js',
        //         'js/**/*.jsx',
        //         'test/**/*.js',
        //         'webapp/**/*.js'
        //     ],
        //     options: {
        //         config: '.jscsrc',
        //         excludeFiles: [
        //             '*.js',
        //             'js/kidoju.*.js',
        //             'js/vendor/**/*.js',
        //             'test/vendor/**/*.js',
        //             'webapp/public/**/*.js'
        //         ]
        //     }
        // },
        // jshint: {
        //     files: [
        //         'js/**/app.*.js',
        //         'js/**/*.jsx',
        //         'test/**/*.js',
        //         'webapp/**/*.js'
        //     ],
        //     options: {
        //         // .jshintignore does ot work with grunt-contrib-jshint
        //         ignores: [
        //             '*.js',
        //             'js/kidoju.*.js',
        //             'js/vendor/**/*.js',
        //             'test/vendor/**/*.js',
        //             'webapp/public/**/*.js'
        //         ],
        //         jshintrc: true
        //     }
        // },
        /*
        // Kendo Lint is now obsolete
        kendo_lint: {
            files: ['src/js/app*.js']
        },
        */
        mocha: {
            // In browser (phantomJS) unit tests
            browser: {
                options: {
                    log: true,
                    logErrors: true,
                    reporter: 'Spec',
                    run: true,
                    timeout: 5000,
                },
                src: ['test/browser/**/*.html'],
            },
        },
        mochaTest: {
            // In node (Zombie) unit tests
            node: {
                options: {
                    quiet: false,
                    reporter: 'spec',
                    timeout: 10000,
                    ui: 'bdd',
                },
                src: ['test/node/**/*.js'],
            },
        },
        /*
        nsp: {
            package: pkg
        },
        */
        splitfile: {
            options: {
                separator: '<!-- split here -->',
                prefix: ['_head', '_foot'],
            },
            'www/views': 'www/views/main.html',
        },
        stylelint: {
            options: {
                configFile: '.stylelintrc',
            },
            src: ['styles/**/*.{css,less,scss}'],
        },
        uglify: {
            build: {
                options: {
                    banner,
                    sourceMap: false,
                    // sourceMap: true,
                    // sourceMapName: 'webapp/public/build/workerlib.bundle.js.map'
                },
                files: {
                    'webapp/public/build/workerlib.bundle.js': [
                        'src/js/vendor/jashkenas/underscore.js',
                        'src/js/vendor/khan/kas.js',
                        'src/js/kidoju.data.workerlib.js',
                    ],
                },
            },
        },
        webdriver: {
            // Selenium functional tests
            appium: {
                configFile: './wdio.appium.conf.js',
            },
            selenium: {
                configFile: './wdio.selenium.conf.js',
            },
        },
        webpack: {
            // @see https://github.com/webpack/webpack-with-common-libs/blob/master/Gruntfile.js
            options: webpackConfig,
            build: {
                cache: false,
                devtool: false,
                plugins: webpackConfig.plugins.concat(
                    new webpack.BannerPlugin({
                        banner,
                        raw: true,
                        // entryOnly: true
                    })
                ),
            },
        },
    });

    // Load npm tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-eslint');
    // grunt.loadNpmTasks('grunt-jscs');
    // grunt.loadNpmTasks('grunt-kendo-lint');
    grunt.loadNpmTasks('grunt-mocha');
    grunt.loadNpmTasks('grunt-mocha-test');
    // grunt.loadNpmTasks('grunt-nsp');
    grunt.loadNpmTasks('grunt-split-file');
    grunt.loadNpmTasks('grunt-stylelint');
    grunt.loadNpmTasks('grunt-webdriver');
    grunt.loadNpmTasks('grunt-webpack');

    // Commands
    grunt.registerTask('lint', [
        'eslint',
        // 'jscs',
        // 'jshint',
        'stylelint',
        // 'nsp'
    ]); // , 'kendo_lint']);
    grunt.registerTask('build', [
        'splitfile',
        'concat',
        'webpack:build',
        'uglify:build',
        'copy',
    ]);
    // grunt.registerTask('test', ['mocha', 'mochaTest', 'webdriver']);
    grunt.registerTask('test', ['mocha', 'mochaTest']);
    grunt.registerTask('default', ['lint', 'build', 'test']);
};
