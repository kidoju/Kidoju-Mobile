/**
 * Copyright (c) 2013-2016 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true, jquery: true, expr: true */
/* globals describe, it, before, beforeEach */

;(function ($) {

    'use strict';

    var expect = window.chai.expect;
    var sinon = window.sinon;
    var app = window.app;
    var models = app.models;
    var mockDB = app.mockDB;
    var rapi = app.rapi;
    var testData = window.testData;

    var MobileUser = models.MobileUser;
    var MobileUserDataSource = models.MobileUserDataSource;
    var MobileActivity = models.MobileActivity;
    var MobileActivityDataSource = models.MobileActivityDataSource;

    /* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
    var TOKEN = { access_token: 'anAccessTokenForUser0' + 'xx'.replace(/x/g, function () { return '' + Math.floor(1 + 9 * Math.random()); }), expires: 10000000, ts: Date.now() };
    /* jscs:enable requireCamelCaseOrUpperCaseIdentifiers */

    describe('app.mobile.models', function () {

        before(function (done) {
            mockDB.load()
                .done(done)
                .fail(function (xhr, status, error) {
                    done(new Error(this.url + ' ' + error));
                });
        });

        describe('MobileUser', function () {

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

            beforeEach(function () {
                window.sessionStorage.removeItem('me');
                window.localStorage.removeItem('token');
                rapi.util.setToken(TOKEN);
            });

            it('MobileUser should have certain fields and calculated fields', function () {
                var user0 = testData.users[0];
                var user = new MobileUser(user0);
                expect(user).to.have.property('id', user0.id);
                expect(user).to.have.property('sid', user0.sid);
                expect(user).to.have.property('firstName', user0.firstName);
                expect(user).to.have.property('lastName', user0.lastName);
                expect(user).to.have.property('lastSync', user0.lastSync);
                expect(user).to.have.property('lastUse', user0.lastUse);
                expect(user).to.have.property('md5pin', user0.md5pin);
                expect(user).to.have.property('picture', user0.picture);
                // TODO: test fullName$, picture$ and mobilePicture$ functions here
            });

            /*
            it('MobileUser should be able to reset a pin', function () {
                var user0 = testData.users[0];
                var user = new MobileUser(user0);
                expect(user).to.have.property('md5pin', user0.md5pin);
                user.resetPin();
                expect(user).to.have.property('md5pin', null);
            });
            */

            it('MobileUser should be able to add and verify a pin', function () {
                var user1 = testData.users[1];
                var pin0 = testData.pins[0];
                var pin1 = testData.pins[1];
                var user = new MobileUser(user1);
                expect(user).to.have.property('md5pin', null); // user1.md5pin);
                user.addPin(pin0);
                expect(user).to.have.property('md5pin').that.is.a('string');
                expect(user.verifyPin(pin0)).to.be.true;
                expect(user.verifyPin(pin1)).to.be.false;
            });

            it('MobileUser should be able to save picture', function (done) {
                var user1 = testData.users[1];
                var user = new MobileUser(user1);
                // This might trigger an authorization confirmation to use file storage
                user._saveMobilePicture()
                    .done(function (fileEntry) {
                        expect(fileEntry.isFile).to.be.true;
                        done();
                    })
                    .fail(done);
            });

            it('MobileUser should load current user (me) from remote server', function (done) {
                var user = new MobileUser();
                user.load()
                    .done(function (data) {
                        // Data
                        expect(data).to.have.property('id').that.is.a('STRING');
                        expect(data).to.have.property('firstName').that.is.a('STRING');
                        expect(data).to.have.property('lastName').that.is.a('STRING');
                        expect(data).to.have.property('picture').that.is.a('STRING');
                        // User
                        expect(user).to.have.property('sid', data.id); // id becomes sid, a server id
                        expect(user).to.have.property('firstName', data.firstName);
                        expect(user).to.have.property('lastName', data.lastName);
                        expect(user).to.have.property('lastUse').that.is.an.instanceof(Date);
                        expect(user).to.have.property('md5pin', null);
                        expect(user).to.have.property('picture', data.picture);
                        done();
                    })
                    .fail(function (xhr, status, error) {
                        done(new Error(error));
                    });
            });

        });

        describe('MobileUserDataSource', function () {

            var me;

            beforeEach(function () {
                window.sessionStorage.removeItem('me');
                window.localStorage.removeItem('token');
                rapi.util.setToken(TOKEN);
            });

            it('MobileUserDataSource should fail to add a user without a pin', function (done) {
                var user = new MobileUser();
                var users = new MobileUserDataSource();
                user.load()
                    .done(function () {
                        // Add to dataSource
                        users.add(user);
                        // Sync dataSource
                        users.sync()
                            .done(function () {
                                done(new Error('Creating a new user without pin should fail'));
                            })
                            .fail(function (xhr, status, error) {
                                done();
                            });
                    })
                    .fail(function (xhr, status, error) {
                        done(new Error(error));
                    });
            });

            it('MobileUserDataSource should successfully add a new user with a pin', function (done) {
                var user = new MobileUser();
                var users = new MobileUserDataSource();
                user.load()
                    .done(function () {
                        // Add pin to user
                        user.addPin(testData.pins[0]);
                        // Add to dataSource
                        users.add(user);
                        // Keep track of data for further tests
                        me = user.toJSON();
                        // Sync dataSource
                        users.sync()
                            .done(done)
                            .fail(function (xhr, status, error) {
                                done(new Error(error));
                            });
                    })
                    .fail(function (xhr, status, error) {
                        done(new Error(error));
                    });
            });

            it('MobileUserDataSource should fail to add the same user twice', function (done) {
                var user = new MobileUser();
                var users = new MobileUserDataSource();
                user.load()
                    .done(function () {
                        // Add pin to user
                        user.addPin(testData.pins[0]);
                        // Add to dataSource
                        users.add(user);
                        // Sync dataSource
                        users.sync()
                            .done(function () {
                                done(new Error('Creating a duplicated user should fail'));
                            })
                            .fail(function (xhr, status, error) {
                                // TODO test error
                                done();
                            });
                    })
                    .fail(function (xhr, status, error) {
                        done(new Error(error));
                    });
            });

            it('MobileUserDataSource should read users', function (done) {
                var users = new MobileUserDataSource();
                expect(users.total()).to.equal(0);
                users.read()
                    .done(function () {
                        expect(users.total()).to.be.gt(0);
                        done();
                    })
                    .fail(function (xhr, status, error) {
                        done(new Error(error));
                    });
            });

            it('MobileUserDataSource should filter users', function (done) {
                var users = new MobileUserDataSource();
                users.query({ filter: { field: 'sid', operator: 'eq', value: me.sid } })
                    .done(function () {
                        expect(users.total()).to.equal(1);
                        done();
                    })
                    .fail(function (xhr, status, error) {
                        done(new Error(error));
                    });
            });

            it('MobileUserDataSource should sort users', function (done) {
                var users = new MobileUserDataSource();
                users.read()
                    .done(function () {
                        var sorted = users.data().sort(function (a, b) { return b.lastUse - a.lastUse; });
                        users.query({ sort: { field: 'lastUse', dir: 'desc' } })
                            .done(function () {
                                expect(users.at(0)).to.equal(sorted[0]);
                                done();
                            })
                            .fail(function (xhr, status, error) {
                                done(new Error(error));
                            });
                    })
                    .fail(function (xhr, status, error) {
                        done(new Error(error));
                    });
            });

            it('MobileUserDataSource should update users', function (done) {
                var users = new MobileUserDataSource();
                users.query({ filter: { field: 'sid', operator: 'eq', value: me.sid } })
                    .done(function () {
                        expect(users.total()).to.equal(1);
                        var user = users.at(0);
                        expect(user.dirty).to.be.false;
                        user.addPin(testData.pins[1]);
                        expect(user.dirty).to.be.true;
                        users.sync()
                            .done(function () {
                                expect(users.at(0).verifyPin(testData.pins[1])).to.be.true;
                                done();
                            })
                            .fail(function (xhr, status, error) {
                                done(new Error(error));
                            });
                    })
                    .fail(function (xhr, status, error) {
                        done(new Error(error));
                    });
            });

            it('MobileUserDataSource should destroy users', function (done) {
                var users = new MobileUserDataSource();
                users.read()
                    .done(function () {
                        while (users.total()) {
                            users.remove(users.at(0));
                        }
                        users.sync()
                            .done(function () {
                                expect(users.total()).to.equal(0);
                                done();
                            })
                            .fail(function (xhr, status, error) {
                                done(new Error(error));
                            });
                    })
                    .fail(function (xhr, status, error) {
                        done(new Error(error));
                    });
            });
        });

        describe('MobileActivity', function () {

            it('MobileActivity should have certain fields and calculated fields', function () {
                var activity0 = testData.activities[0];
                var activity = new MobileActivity(activity0);
                expect(activity).to.have.property('id', activity0.id);
                expect(activity).to.have.property('sid', activity0.sid);
                expect(activity).to.have.property('actorId', activity0.actorId);
                // expect(activity).to.have.property('data', activity0.data);
                expect(activity).to.have.property('language', activity0.language);
                expect(activity).to.have.property('summaryId', activity0.summaryId);
                expect(activity).to.have.property('title', activity0.title);
                expect(activity).to.have.property('type', activity0.type);
                expect(activity).to.have.property('versionId', activity0.versionId);
                // TODO: test field$ functions here
            });

        });

        describe('MobileActivityDataSource', function () {

            var me;

            beforeEach(function (done) {
                window.sessionStorage.removeItem('me');
                window.localStorage.removeItem('token');
                rapi.util.setToken(TOKEN);
                me = new MobileUser();
                me.load().done(function () { done(); }).fail(done);
            });

            it('MobileActivityDataSource should successfully add a new user activity', function (done) {
                // First activity (from another user which does not exist in the users collection)
                var activity0 = testData.activities[0];
                activity0.id = null; // Otherwise it is not new for kendo
                activity0 = new MobileActivity(activity0);
                var activities0 = new MobileActivityDataSource({ userId: activity0.get('actorId') });
                activities0.add(activity0);
                // Second activity (from me)
                var activity1 = testData.activities[1];
                activity1.id = null; // Otherwise it is not new for kendo
                activity1.actorId = me.get('sid');
                activity1 = new MobileActivity(activity1);
                var activities1 = new MobileActivityDataSource({ userId: activity1.get('actorId') });
                activities1.add(activity1);
                // Sync
                $.when(
                    activities0.sync(),
                    activities1.sync()
                )
                    .done(done)
                    .fail(function (xhr, status, error) {
                        done(new Error(error));
                    });
            });

            it('MobileActivityDataSource should fail to add an new activity for another user', function (done) {
                var activity1 = testData.activities[1];
                expect(activity1.id).to.be.null; // Otherwise it is not new for kendo
                activity1.actorId = testData.users[0].sid;
                var activity = new MobileActivity(activity1);
                var activities = new MobileActivityDataSource({ userId: me.get('sid') });
                activities.add(activity);
                activities.sync()
                    .done(function () {
                        done(new Error('Creating a new activity for another user should fail'));
                    })
                    .fail(function () {
                        done();
                    });
            });

            it('MobileActivityDataSource should read and load activities for different users (user switch)', function (done) {
                var activity0 = testData.activities[0];
                var activities = new MobileActivityDataSource({ userId: me.get('sid') });
                expect(activities.total()).to.equal(0);
                activities.read()
                    .done(function () {
                        expect(activities.total()).to.equal(1);
                        expect(activities.at(0).get('actorId')).to.equal(me.get('sid'));
                        activities.load({ userId: activity0.actorId })
                            .done(function () {
                                expect(activities.total()).to.equal(1);
                                expect(activities.at(0).get('actorId')).to.equal(activity0.actorId);
                                done();
                            })
                            .fail(function (xhr, status, error) {
                                done(new Error(error));
                            });
                    })
                    .fail(function (xhr, status, error) {
                        done(new Error(error));
                    });
            });

            it('MobileActivityDataSource should filter activities', function (done) {
                var activities = new MobileActivityDataSource({ userId: me.get('sid') });
                activities.query({ filter: { field: 'language', operator: 'eq', value: 'fr' } })
                    .done(function () {
                        expect(activities.total()).to.equal(0);
                        done();
                    })
                    .fail(function (xhr, status, error) {
                        done(new Error(error));
                    });
            });

            it('MobileActivityDataSource should update activities', function (done) {
                var activities = new MobileActivityDataSource({ userId: me.get('sid') });
                var DATA = 'Whatever';
                activities.read()
                    .done(function () {
                        expect(activities.total()).to.equal(1);
                        var activity = activities.at(0);
                        expect(activity.dirty).to.be.false;
                        activity.set('data', DATA);
                        expect(activity.dirty).to.be.true;
                        activities.sync()
                            .done(function () {
                                expect(activities.at(0).get('data') === DATA).to.be.true;
                                done();
                            })
                            .fail(function (xhr, status, error) {
                                done(new Error(error));
                            });
                    })
                    .fail(function (xhr, status, error) {
                        done(new Error(error));
                    });
            });

            it('MobileActivityDataSource should upload pending activities (serverSync step 1)', function (done) {
                var activities = new MobileActivityDataSource({ userId: me.get('sid') });
                activities._uploadPendingActivities()
                    .progress(function (progress) {
                        // expect(progress)
                    })
                    .done(function () {
                        // TODO
                        done();
                    })
                    .fail(function (xhr, status, error) {
                        done(new Error(error));
                    });
            });

            it('MobileActivityDataSource should purge old activities (serverSync step 2)', function (done) {
                var activities = new MobileActivityDataSource({ userId: me.get('sid') });
                activities._purgeOldActivities()
                    .progress(function (progress) {
                        // expect(progress)
                    })
                    .done(function () {
                        // TODO
                        done();
                    })
                    .fail(function (xhr, status, error) {
                        done(new Error(error));
                    });
            });

            it('MobileActivityDataSource should download recent activities (serverSync step 3)', function (done) {
                var activities = new MobileActivityDataSource({ userId: me.get('sid') });
                activities._downloadRecentActivities()
                    .progress(function (progress) {
                        // expect(progress)
                    })
                    .done(function () {
                        // TODO
                        done();
                    })
                    .fail(function (xhr, status, error) {
                        done(new Error(error));
                    });
            });

            it('MobileActivityDataSource should sync activities', function (done) {
                var activities = new MobileActivityDataSource({ userId: me.get('sid') });
                activities.serverSync()
                    .progress(function (progress) {
                        // expect(progress)
                    })
                    .done(function () {
                        // TODO
                        done();
                    })
                    .fail(function (xhr, status, error) {
                        done(new Error(error));
                    });
            });

            it('MobileActivityDataSource should destroy activities', function (done) {
                var activities = new MobileActivityDataSource({ userId: me.get('sid') });
                activities.read()
                    .done(function () {
                        while (activities.total()) {
                            activities.remove(activities.at(0));
                        }
                        activities.sync()
                            .done(function () {
                                expect(activities.total()).to.equal(0);
                                done();
                            })
                            .fail(function (xhr, status, error) {
                                done(new Error(error));
                            });
                    })
                    .fail(function (xhr, status, error) {
                        done(new Error(error));
                    });
            });

        });

    });

}(window.jQuery));
