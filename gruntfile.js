/**
 * Copyright (c) 2013-2014 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba/Kidoju-Platform
 */

/* jslint node: true */
/* jshint node: true */

'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mocha: {
            unit: { //In browser unit tests
                src: ['test/unit/*.html'],
                options: {
                    run: true,
                    //log: true,
                    //debug: true,
                    timeout: 5000
                }
            }
        },
        mochaTest: { //zombie
            ui: {
                src: ['test/ui/*.js'],
                options: {
                    reporter: 'spec'
                }
            }
        },
        jshint: {
            files: ['gruntfile.js', 'www/js/*.js'],
            options: {
                // options here to override JSHint defaults
                jshintrc: '.jshintrc'
                /*
                 globals: {
                 jQuery: true,
                 console: true,
                 module: true,
                 document: true
                 }
                 */
            }
        },
        kendo_lint: { // TODO: html too
            files: ['www/js/*.js']
        },
        csslint: {
            strict: {
                options: {
                    import: 2
                },
                src: ['www/styles/*.css']
            }
        }
    });

    //Lint
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-kendo-lint');
    grunt.loadNpmTasks('grunt-contrib-csslint');

    //Tests
    grunt.loadNpmTasks('grunt-mocha');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('lint', ['jshint', 'kendo_lint', 'csslint']);
    grunt.registerTask('test', ['mocha', 'mochaTest']);
    grunt.registerTask('default', ['lint', 'test']);

};