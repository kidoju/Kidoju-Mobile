/**
 * Copyright (c) 2013-2016 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true */
/* global describe, it, expect */

;(function (window) {

    'use strict';

    var expect = window.chai.expect;
    var app = window.app;
    var models = app.models;
    var mockDB = app.mockDB;
    var rapi = app.rapi;
    var testData = window.testData;
    var runData = {};

    /* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
    var TOKEN = { access_token: 'anAccessTokenForUser0' + 'xx'.replace(/x/g, function() { return '' + Math.floor(1 + 9 * Math.random()) }), expires: 10000000, ts: Date.now() };
    /* jscs:enable requireCamelCaseOrUpperCaseIdentifiers */

    describe('app.mobile.models', function () {

        before(function(done) {
            mockDB.load()
                .done(done)
                .fail(function(xhr, status, error) {
                    done(new Error(this.url + ' ' + error));
                });
        });

        describe('MobileUser', function () {

            var MobileUser = models.MobileUser;

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

            it('MobileUser should be able to reset a pin', function () {
                var user0 = testData.users[0];
                var user = new MobileUser(user0);
                expect(user).to.have.property('md5pin', user0.md5pin);
                user.resetPin();
                expect(user).to.have.property('md5pin', null);
            });

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
                        expect(user).to.have.property('sid', data.id); //id becomes sid, a server id
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

            var MobileUser = models.MobileUser;
            var MobileUserDataSource = models.MobileUserDataSource;

            beforeEach(function () {
                window.sessionStorage.removeItem('me');
                window.localStorage.removeItem('token');
                rapi.util.setToken(TOKEN);
            });

            it('MobileUserDataSource should fail to add a user without a pin', function (done) {
                var user = new MobileUser();
                var users = new models.MobileUserDataSource();
                user.load()
                    .done(function() {
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
                    .fail(function(xhr, status, error) {
                        done(new Error(error));
                    });
            });

            it('MobileUserDataSource should successfully add a new user with a pin', function (done) {
                var user = new MobileUser();
                var users = new models.MobileUserDataSource();
                user.load()
                    .done(function() {
                        // Add pin to user
                        user.addPin(testData.pins[0]);
                        // Add to dataSource
                        users.add(user);
                        // Keep track of data for further tests
                        runData.user = user.toJSON();
                        // Sync dataSource
                        users.sync()
                            .done(done)
                            .fail(function () {
                                done(new Error('Creating a new user with a pin should succeed'));
                            });
                    })
                    .fail(function(xhr, status, error) {
                        done(new Error(error));
                    });
            });

            it('MobileUserDataSource should fail to add the same user twice', function (done) {
                var user = new MobileUser();
                var users = new models.MobileUserDataSource();
                user.load()
                    .done(function() {
                        // Add pin to user
                        user.addPin(testData.pins[0]);
                        // Add to dataSource
                        users.add(user);
                        // No need to keep track of data for further tests, we have done it already
                        // runData.user = user.toJSON();
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
                    .fail(function(xhr, status, error) {
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
                    .fail(function () {
                        done(new Error('Reading users should succeed'));
                    });
            });

            it('MobileUserDataSource should filter users', function (done) {
                var users = new MobileUserDataSource();
                users.query({ filter: { field: 'sid', operator: 'eq', value: runData.user.sid } })
                    .done(function () {
                        expect(users.total()).to.equal(1);
                        done();
                    })
                    .fail(function(xhr, status, error) {
                        done(new Error(error));
                    });
            });

            it('MobileUserDataSource should sort users', function (done) {
                var users = new MobileUserDataSource();
                users.read()
                    .done(function () {
                        var sorted = users.data().sort(function (a, b) { return b.lastUse - a.lastUse });
                        users.query({ sort: { field: 'lastUse', dir: 'desc' } })
                            .done(function () {
                                expect(users.at(0)).to.equal(sorted[0]);
                                done();
                            })
                            .fail(function(xhr, status, error) {
                                done(new Error(error));
                            });
                    })
                    .fail(function(xhr, status, error) {
                        done(new Error(error));
                    });
            });

            it('MobileUserDataSource should update users', function (done) {
                var users = new MobileUserDataSource();
                users.query({ filter: { field: 'sid', operator: 'eq', value: runData.user.sid } })
                    .done(function () {
                        expect(users.total()).to.equal(1);
                        users.at(0).addPin(testData.pins[1]);
                        users.sync()
                            .done(function () {
                                expect(users.at(0).verifyPin(testData.pins[1])).to.be.true;
                                done();
                            })
                            .fail(function () {
                                done(new Error('Updating a user should succeed'));
                            });
                    })
                    .fail(function () {
                        done(new Error(error));
                    })
            });

            it('MobileUserDataSource should destroy users', function (done) {
                var users = new MobileUserDataSource();
                users.read()
                    .done(function () {
                        while(users.total()) {
                            users.remove(users.at(0));
                        }
                        users.sync()
                            .done(function () {
                                expect(users.total()).to.equal(0);
                                done();
                            })
                            .fail(function(xhr, status, error) {
                                done(new Error(error));
                            });
                    })
                    .fail(function(xhr, status, error) {
                        done(new Error(error));
                    });
            });
        });

        describe('MobileActivity', function () {

            var MobileActivity = models.MobileActivity;

            xit('', function () {

            });

        });

        describe('MobileActivityDataSource', function () {

            var MobileActivity = models.MobileActivity;
            var MobileActivityDataSource = models.MobileActivityDataSource;

            xit('', function () {

            });

        });

    });

}(this));
