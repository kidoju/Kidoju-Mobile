// Karma configuration
module.exports = (config) => {
    config.set({
        // mocha configuration
        client: {
            mocha: {
                ui: 'bdd',
                timeout: 10000,
            },
        },

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // Increase timeout especially for phantomJS
        browserDisconnectTimeout: 5000,

        // Frameworks to use (do not include sinon-chai)
        // Available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'webpack'],

        // list of files / patterns to load in the browser
        // See: http://karma-runner.github.io/0.12/config/files.html
        files: [
            {
                pattern: 'src/styles/vendor/kendo/web/kendo.common.min.css',
                served: true,
                included: true,
            },
            {
                pattern: 'src/styles/vendor/kendo/web/kendo.default.min.css',
                served: true,
                included: true,
            },
            {
                pattern:
                    'src/styles/vendor/kendo/web/kendo.default.mobile.min.css',
                served: true,
                included: true,
            },
            {
                pattern: 'src/js/vendor/kendo/jquery.min.js',
                served: true,
                included: true,
            },
            {
                pattern: 'src/js/vendor/kendo/kendo.all.min.js',
                served: true,
                included: true,
            },
            {
                pattern: 'src/js/window.assert.js',
                served: true,
                included: true,
            },
            {
                pattern: 'src/js/window.logger.js',
                served: true,
                included: true,
            },
            {
                pattern: 'src/js/kidoju.data.js',
                served: true,
                included: true,
            },
            {
                pattern: 'src/js/kidoju.data.workerlibjs',
                served: true,
                included: false,
            },
            {
                pattern: 'src/js/kidoju.tools.js',
                served: true,
                included: true,
            },
            {
                pattern: 'src/js/kidoju.widgets.assetmanager.js',
                served: true,
                included: true,
            },
            {
                pattern: 'src/js/kidoju.widgets.codeeditor.js',
                served: true,
                included: true,
            },
            {
                pattern: 'src/js/kidoju.widgets.codeinput.js',
                served: true,
                included: true,
            },
            {
                pattern: 'src/js/kidoju.widgets.explorer.js',
                served: true,
                included: true,
            },
            {
                pattern: 'src/js/kidoju.widgets.mediaplayer.js',
                served: true,
                included: true,
            },
            {
                pattern: 'src/js/kidoju.widgets.multiinput.js',
                served: true,
                included: true,
            },
            {
                pattern: 'src/js/kidoju.widgets.navigation.js',
                served: true,
                included: true,
            },
            {
                pattern: 'src/js/kidoju.widgets.playbar.js',
                served: true,
                included: true,
            },
            {
                pattern: 'src/js/kidoju.widgets.propertygrid.js',
                served: true,
                included: true,
            },
            {
                pattern: 'src/js/kidoju.widgets.quiz.js',
                served: true,
                included: true,
            },
            {
                pattern: 'src/js/kidoju.widgets.rating.js',
                served: true,
                included: true,
            },
            {
                pattern: 'src/js/kidoju.widgets.stage.js',
                served: true,
                included: true,
            },
            {
                pattern: 'src/js/kidoju.widgets.styleeditor.js',
                served: true,
                included: true,
            },
            {
                pattern: 'src/js/kidoju.widgets.toolbox.js',
                served: true,
                included: true,
            },
            {
                pattern: 'test/vendor/chai-jquery.js',
                served: true,
                included: true,
            },
            {
                pattern: 'test/vendor/jquery.simulate.js',
                served: true,
                included: true,
            },
            // Our tests
            {
                pattern: 'test/browsers/*.js',
                served: true,
                included: true,
            },
            // served but not included
            {
                pattern: 'test/data/*.json',
                served: true,
                included: false,
            },
            {
                pattern: 'src/**/*.*',
                served: true,
                included: false,
            },
        ],

        // list of files to exclude
        exclude: ['/**/Thumbs.db'],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            // Do not add the coverage preprocessor
            // @see https://github.com/istanbuljs/babel-plugin-istanbul#karma
            //  '/src/js/*.js': ['coverage']
            '/src/js/**/*.es6': ['coverage'],
            'test/browser/**/*.test.es6': ['webpack', 'sourcemap'],
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [
            'Chrome',
            'Edge',
            'Firefox',
            'IE',
            'Opera',
            'PhantomJS',
            'Safari',
        ],

        // optionally, configure the reporter
        coverageReporter: {
            type: 'html',
            dir: 'coverage/',
        },

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,
    });
};
