/**
 * Copyright (c) 2013-2017 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true, expr: true */
/* globals describe, it, before */

;(function ($, undefined) {

    'use strict';

    var expect = window.chai.expect;
    var sinon = window.sinon;
    var FileSystem = window.app.FileSystem;

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
                            .fail(done);
                    })
                    .fail(done);
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
                            .fail(done);
                    })
                    .fail(done);
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
                    .fail(done);
            });

        });

        describe('getDirectoryEntry', function () {

            it('it should fail to get a directoryEntry if FileSystem has not been initialized', function (done) {
                var fileSystem = new FileSystem();
                var path = '/images';
                fileSystem.getDirectoryEntry(path, window.TEMPORARY)
                    .done(function () {
                        done(new Error('Making a directory without initializing a FileSystem should fail'));
                    })
                    .fail(function (err) {
                        expect(err).to.be.an.instanceof(Error);
                        done();
                    });
            });

            it('it should get a directoryEntry in a temporary FileSystem', function (done) {
                var fileSystem = new FileSystem();
                fileSystem.init()
                    .done(function () {
                        var path = '/images';
                        fileSystem.getDirectoryEntry(path, window.TEMPORARY)
                            .done(function (directoryEntry) {
                                expect(directoryEntry).not.to.be.undefined;
                                expect(directoryEntry.isDirectory).to.be.true;
                                expect(directoryEntry.fullPath).to.equal(path);
                                done();
                            })
                            .fail(done);
                    })
                    .fail(done);
            });

            it('it should get a directoryEntry in a persistent FileSystem', function (done) {
                var fileSystem = new FileSystem();
                fileSystem.init()
                    .done(function (fs) {
                        var path = '/images/icons/office';
                        fileSystem.getDirectoryEntry(path, window.PERSISTENT)
                            .done(function (directoryEntry) {
                                expect(directoryEntry).not.to.be.undefined;
                                expect(directoryEntry.isDirectory).to.be.true;
                                expect(directoryEntry.fullPath).to.equal(path);
                                done();
                            })
                            .fail(done);
                    })
                    .fail(done);
            });

        });

        describe('getFileEntry', function () {

            it('it should get a fileEntry in a temporary FileSystem', function (done) {
                var fileSystem = new FileSystem();
                var path = '/images';
                var fileName = 'temp.jpg';
                fileSystem.init()
                    .done(function () {
                        fileSystem.getDirectoryEntry(path, window.TEMPORARY)
                            .done(function (directoryEntry) {
                                fileSystem.getFileEntry(directoryEntry, fileName)
                                    .done(function (fileEntry) {
                                        expect(fileEntry).not.to.be.undefined;
                                        expect(fileEntry.isFile).to.be.true;
                                        expect(fileEntry.name).to.equal(fileName);
                                        expect(fileEntry.fullPath).to.equal(path + '/' + fileName);
                                        done();
                                    })
                                    .fail(done);
                            })
                            .fail(done);
                    })
                    .fail(done);
            });

            it('it should get a fileEntry in a persistent FileSystem', function (done) {
                var fileSystem = new FileSystem();
                var path = '/images';
                var fileName = 'temp.jpg';
                fileSystem.init()
                    .done(function () {
                        fileSystem.getDirectoryEntry(path, window.PERSISTENT)
                            .done(function (directoryEntry) {
                                fileSystem.getFileEntry(directoryEntry, fileName)
                                    .done(function (fileEntry) {
                                        expect(fileEntry).not.to.be.undefined;
                                        expect(fileEntry.isFile).to.be.true;
                                        expect(fileEntry.name).to.equal(fileName);
                                        expect(fileEntry.fullPath).to.equal(path + '/' + fileName);
                                        done();
                                    })
                                    .fail(done);
                            })
                            .fail(done);
                    })
                    .fail(done);
            });

        });

        describe('download', function () {

            var transfer = sinon.spy();

            before(function () {
                // Create a stub for window.FileTransfer
                window.FileTransfer = function () {};

                /* This function has too many parameters. */
                /* jshint -W072 */

                window.FileTransfer.prototype.download = function (remoteUrl, fileUrl, successCallback, errorCallback, trueAllHosts, options) {
                    window.resolveLocalFileSystemURL = window.resolveLocalFileSystemURL || window.webkitResolveLocalFileSystemURL;
                    window.resolveLocalFileSystemURL(fileUrl, function (fileEntry) {
                        transfer(fileUrl);
                        successCallback(fileEntry);
                    });
                };

                /* jshint +W072 */
            });

            it('it should download a remote url to a temporary FileSystem', function (done) {
                var fileSystem = new FileSystem();
                var remoteUrl = 'https://cdn.kidoju.com/kidoju/kidoju.logo.png';
                var path = '/images';
                var fileName = 'logo.png';
                fileSystem.init()
                    .done(function () {
                        fileSystem.getDirectoryEntry(path, window.TEMPORARY)
                            .done(function (directoryEntry) {
                                fileSystem.getFileEntry(directoryEntry, fileName)
                                    .done(function (fileEntry) {
                                        fileSystem.download(remoteUrl, fileEntry)
                                            .done(function (entry) {
                                                expect(transfer).to.have.been.calledOnce;
                                                expect(transfer).to.have.been.calledWith(entry.toURL());
                                                done();
                                            })
                                            .fail(done);
                                    })
                                    .fail(done);
                            })
                            .fail(done);
                    })
                    .fail(done);
            });

        });

    });

}(window.jQuery));
