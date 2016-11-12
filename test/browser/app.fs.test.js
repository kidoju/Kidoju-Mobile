/**
 * Copyright (c) 2013-2016 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true, expr: true */
/* global describe, it, before */

;(function ($, undefined) {

    'use strict';

    var expect = window.chai.expect;
    var FileSystem = app.mobile.FileSystem;

    describe('app.fs', function () {

        describe('Initialization', function () {

            it('it should init a window.TEMPORARY file system', function (done) {
                var fileSystem = new FileSystem();
                fileSystem._initTemporary()
                    .done(function (temporary) {
                        // expect(temporary).to.be.an('object');
                        expect(temporary).not.to.be.undefined;
                        fileSystem._initTemporary()
                            .done(function (fs) {
                                expect(fs).to.equal(temporary);
                                done();
                            })
                            .fail(function () {
                                done(new Error('Reinitializing a temporary FileSystem should not fail'));
                            });
                    })
                    .fail(function () {
                        done(new Error('Initializing a temporary FileSystem should not fail'));
                    });
            });

            it('it should init a window.PERSISTENT file system', function (done) {
                var fileSystem = new FileSystem();
                fileSystem._initPersistent()
                    .done(function (persistent) {
                        // expect(persistent).to.be.an('object');
                        expect(persistent).not.to.be.undefined;
                        fileSystem._initPersistent()
                            .done(function (fs) {
                                expect(fs).to.equal(persistent);
                                done();
                            })
                            .fail(function () {
                                done(new Error('Reinitializing a persistent FileSystem should not fail'));
                            });
                    })
                    .fail(function () {
                        done(new Error('Initializing a persistent FileSystem should not fail'));
                    });
            });

            it('it should init a file system (temporary and persistent)', function (done) {
                var fileSystem = new FileSystem();
                fileSystem.init()
                    .done(function (temporary, persistent) {
                        // expect(temporary).to.be.an('object');
                        // expect(persistent).to.be.an('object');
                        expect(temporary).not.to.be.undefined;
                        expect(persistent).not.to.be.undefined;
                        done();
                    })
                    .fail(function () {
                        done(new Error('Initializing a FileSystem should not fail'));
                    });
            });

        });

        describe('MakeDir', function () {

            it('it should fail to make a directory if FileSystem has not been initialized', function (done) {
                var fileSystem = new FileSystem();
                var fullPath = '/images';
                fileSystem.getDirectoryEntry(fullPath, window.TEMPORARY)
                    .done(function () {
                        done(new Error('Making a directory without initializing a FileSystem should fail'));
                    })
                    .fail(function (err) {
                        expect(err).to.be.an.instanceof(Error);
                        done();
                    });
            });

            it('it should make a directory in a temporary FileSystem', function (done) {
                var fileSystem = new FileSystem();
                fileSystem.init()
                    .done(function () {
                        var fullPath = '/images';
                        fileSystem.getDirectoryEntry(fullPath, window.TEMPORARY)
                            .done(function (directoryEntry) {
                                expect(directoryEntry).not.to.be.undefined;
                                expect(directoryEntry.isDirectory).to.be.true;
                                expect(directoryEntry.fullPath).to.equal(fullPath);
                                done();
                            })
                            .fail(done);
                    })
                    .fail(function () {
                        done(new Error('Initializing a FileSystem should not fail'));
                    });
            });

            it('it should make a directory in a persistent FileSystem', function (done) {
                var fileSystem = new FileSystem();
                fileSystem.init()
                    .done(function (fs) {
                        var fullPath = '/images/icons/office';
                        fileSystem.getDirectoryEntry(fullPath, window.PERSISTENT)
                            .done(function (directoryEntry) {
                                expect(directoryEntry).not.to.be.undefined;
                                expect(directoryEntry.isDirectory).to.be.true;
                                expect(directoryEntry.fullPath).to.equal(fullPath);
                                done();
                            })
                            .fail(done);
                    })
                    .fail(function () {
                        done(new Error('Initializing a FileSystem should not fail'));
                    });
            });

        });

    });

}(window.jQuery));
