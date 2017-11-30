/**
 * Copyright (c) 2013-2017 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true, jquery: true */
/* globals define: false */

(function (f, define) {
    'use strict';
    define([
        './vendor/blueimp/md5', // Keep at the top considering function arguments
        './vendor/kendo/kendo.core',
        './vendor/kendo/kendo.data',
        './window.assert',
        './window.logger',
        './kidoju.data',
        './kidoju.tools',
        './app.constants',
        './app.logger',
        './app.i18n',
        './app.rapi',
        './app.cache',
        './app.db',
        './app.fs',
        './app.models'
    ], f);
})(function (md5H) {

    'use strict';

    /* This function has too many statements. */
    /* jshint -W071 */

    /* This function's cyclomatic complexity is too high. */
    /* jshint -W074 */

    (function ($, undefined) {

        /* jshint maxcomplexity: 8 */

        /**
         * IMPORTANT NOTE 1
         * Lazy models are simplified/flattened readonly models (all properties are non-editable) to load in Lazy datasources
         * Other models are used for CRUD operations and might have nested models like MongoDB schemas
         *
         * IMPORTANT NOTE 2
         * All calculated fields used in MVVM to display properly formatted data are marked with an appended $
         * The reason is to recognize them in kendo templates where they should be used as functions with trailing ()
         * whereas they should be used as properties without trailing () in data-bind attributes
         */

        var app = window.app = window.app || {};
        var models = app.models = app.models || {};
        var kendo = window.kendo;
        var kidoju = window.kidoju;
        var Class = kendo.Class;
        var Model = kidoju.data.Model;
        var DataSource = kidoju.data.DataSource;
        var assert = window.assert;
        var logger = new window.Logger('app.mobile.models');
        var i18n = app.i18n;
        var fileSystem = new app.FileSystem();
        var md5 = md5H || window.md5;
        var pongodb = window.pongodb;
        var db = app.db = new pongodb.Database({
            name: 'KidojuDB',
            size: 5 * 1024 * 1024,
            collections: ['activities', 'users'],
            version: '0.3.4' // TODO
        });
        // var i18n = app.i18n = app.i18n || { };
        // This is for testing only because we should get values from config files (see ./js/app.config.jsx)
        var uris = app.uris = app.uris || {};
        uris.cdn = uris.cdn || {};
        uris.cdn.icons = uris.cdn.icons || 'https://cdn.kidoju.com/images/o_collection/svg/office/{0}.svg';
        uris.mobile = uris.mobile || {};
        uris.mobile.icons = uris.mobile.icons || './img/{0}.svg';
        uris.mobile.pictures = uris.mobile.pictures || '{0}users/{1}';
        var DATE = 'date';
        var FUNCTION = 'function';
        var NULL = 'null';
        var NUMBER = 'number';
        var STRING = 'string';
        var UNDEFINED = 'undefined';
        var RX_LANGUAGE = /^[a-z]{2}$/;
        var RX_MONGODB_ID = /^[a-f0-9]{24}$/;
        var DOT_JPEG = '.jpg';
        var DEFAULT = {
            ROOT_CATEGORY_ID: {
                en: app.constants.rootCategoryId.en || '000100010000000000000000',
                fr: app.constants.rootCategoryId.fr || '000200010000000000000000'
            },
            DATE: new Date(2000, 0, 1) // 1/1/2000
            // LANGUAGE: 'en',
            // THEME: 'flat' // The default theme is actually defined in app.theme.js - make sure they match!
        };
        var STATE = {
            CREATED: 'created',
            DESTROYED: 'destroyed',
            UPDATED: 'updated'
        };

        /**
         * An error helper that converts an error into an array [xhr, status, error]
         * @param error
         * @returns {[*,string,*]}
         * @constructor
         */
        function ErrorXHR(error) {
            assert.instanceof(Error, error, kendo.format(assert.messages.instanceof.default, 'error', 'Error'));
            assert.type(STRING, error.message, kendo.format(assert.messages.type.default, 'error.message', STRING));
            // JSON.stringify(error) is always {} - $.extend is a workaround to collect non-undefined error properties
            var obj = $.extend({}, {
                message: error.message,
                type: error.type,
                code: error.code,
                stack: error.stack && error.stack.toString()
            });
            return [
                { responseText: JSON.stringify({ error: obj }) },
                'error',
                error.message
            ];
        }

        /**
         * A generic mobile transport using pongodb
         */
        models.MobileTransport = Class.extend({

            /**
             * Initialization
             * @constructor
             * @param options
             */
            init: function (options) {
                options = options || {};
                this.collection = options.collection;
                this.setPartition(options.partition);
            },

            /**
             * Sets a table partition (kind of permanent filter)
             * @param partition
             */
            setPartition: function (partition) {
                this._partition = partition;
            },

            /**
             * Validates item against partition
             * @param item
             * @private
             */
            _validate: function (item) {
                var errors = [];
                var partition = this._partition;
                for (var prop in partition) {
                    if (partition.hasOwnProperty(prop)) {
                        var props = prop.split('.');
                        var partProp = partition;
                        var itemProp = item;
                        for (var i = 0, length = props.length; i < length; i++) {
                            partProp = partProp[props[i]];
                            itemProp = itemProp[props[i]];
                        }
                        if ($.type(partProp) !== UNDEFINED && partProp !== itemProp) {
                            var err = new Error('Invalid ' + prop);
                            err.prop = prop;
                            errors.push(err);
                        }
                    }
                }
                return errors;
            },

            /**
             * Create
             * @param options
             */
            create: function (options) {
                assert.isPlainObject(options, kendo.format(assert.messages.isPlainObject.default, 'options'));
                assert.isPlainObject(options.data, kendo.format(assert.messages.isPlainObject.default, 'options.data'));
                logger.debug({
                    message: 'Create mobile data',
                    method: 'app.models.MobileTransport.create',
                    data: options.data
                });
                // Clean object to avoid DataCloneError: Failed to execute 'put' on 'IDBObjectStore': An object could not be cloned.
                var item = JSON.parse(JSON.stringify(options.data));
                var errors = this._validate(item);
                if (errors.length) {
                    var err = new Error('Invalid item');
                    err.errors = errors;
                    return options.error.apply(this, ErrorXHR(err));
                }
                // The database will give us an id (but not a date)
                this.collection.insert(item)
                    .done(function() {
                        options.success({ total: 1, data: [item] });
                    }).fail(function(error) {
                        options.error.apply(this, ErrorXHR(error));
                    });
            },

            /**
             * Destroy
             * @param options
             */
            destroy: function (options) {
                assert.isPlainObject(options, kendo.format(assert.messages.isPlainObject.default, 'options'));
                assert.isPlainObject(options.data, kendo.format(assert.messages.isPlainObject.default, 'options.data'));
                logger.debug({
                    message: 'Destroy mobile data',
                    method: 'app.models.MobileTransport.destroy',
                    data: options.data
                });
                var item = options.data;
                var id = item.id;
                if (RX_MONGODB_ID.test(id)) {
                    this.collection.remove({ id: id })
                        .done(function(result) {
                            if (result && result.nRemoved === 1) {
                                options.success({ total: 1, data: [item] });
                            } else {
                                options.error.apply(this, ErrorXHR(new Error('Item not found')));
                            }
                        }).fail(function(error) {
                            options.error.apply(this, ErrorXHR(error));
                        });
                } else {
                    // No need to hit the database, it won't be found
                    options.error.apply(this, ErrorXHR(new Error('Item not found')));
                }
            },

            /**
             * Read
             * @param options
             */
            read: function (options) {
                logger.debug({
                    message: 'Read mobile data',
                    method: 'app.models.MobileTransport.read',
                    data: options.data
                });
                if ($.type(this._partition) === UNDEFINED) {
                    // This lets us create a dataSource without knowing the partition, which can be set later with setPartition
                    // CReate the MobileTransport with options.partition: false to avoid this test
                    options.success({ total: 0, data: [] });
                } else {
                    // TODO: we need to implement filtering, paging, sorting and grouping
                    // TODO: ideally we should also consider field projections
                    this.collection
                        .find(this._partition).done(function(result) { // TODO: Test this._partition === false
                            if ($.isArray(result)) {
                                options.success({ total: result.length, data: result });
                            } else {
                                options.error.apply(this, ErrorXHR(new Error('Database should return an array')));
                            }
                        }).fail(function(error) {
                            options.error.apply(this, ErrorXHR(error));
                        });
                }
            },

            /**
             * Update
             * @param options
             */
            update: function (options) {
                assert.isPlainObject(options, kendo.format(assert.messages.isPlainObject.default, 'options'));
                assert.isPlainObject(options.data, kendo.format(assert.messages.isPlainObject.default, 'options.data'));
                logger.debug({
                    message: 'Update mobile data',
                    method: 'app.models.MobileTransport.update',
                    data: options.data
                });

                // Clean object to avoid DataCloneError: Failed to execute 'put' on 'IDBObjectStore': An object could not be cloned.
                var item = JSON.parse(JSON.stringify(options.data));
                var errors = this._validate(item);
                if (errors.length) {
                    var err = new Error('Invalid item');
                    err.errors = errors;
                    return options.error.apply(this, ErrorXHR(err));
                }
                var id = item.id;
                if (RX_MONGODB_ID.test(id)) {
                    item.id = undefined;
                    this.collection.update({ id: id }, item)
                        .done(function(result) {
                            if (result && result.nMatched === 1 && result.nModified === 1) {
                                item.id = id;
                                options.success({ total: 1, data: [item] });
                            } else {
                                options.error.apply(this, ErrorXHR(new Error('Item not found')));
                            }
                        }).fail(function(error) {
                            options.error.apply(this, ErrorXHR(error));
                        });
                } else {
                    // No need to hit the database, it won't be found
                    options.error.apply(this, ErrorXHR(new Error('Item not found')));
                }
            }

        });

        /**
         * MobileUser model
         * @type {kidoju.data.Model}
         */
        models.MobileUser = Model.define({
            id: 'id', // the identifier of the model, which is required for isNew() to work
            fields: {
                id: { // mobile id, which cannot be the same as server id otherwise isNew won't work and appropriate transports won't be triggered in DataSource
                    type: STRING,
                    editable: false,
                    nullable: true
                },
                sid: { // mongodb server id
                    type: STRING,
                    editable: false
                },
                firstName: {
                    type: STRING,
                    editable: false
                },
                /*
                language: {
                    type: STRING,
                    defaultValue: DEFAULT.LANGUAGE
                },
                */
                lastName: {
                    type: STRING,
                    editable: false
                },
                // Last time when the mobile device was synchronized with the server for that specific user
                lastSync: {
                    type: DATE,
                    defaultValue: DEFAULT.DATE
                },
                // The current user is the user with the most recent lastUse
                lastUse: {
                    type: DATE,
                    defaultValue: DEFAULT.DATE
                },
                md5pin: {
                    type: STRING,
                    nullable: true
                },
                picture: {
                    type: STRING,
                    editable: false
                },
                rootCategoryId: {
                    type: STRING,
                    defaultValue: function () {
                        return DEFAULT.ROOT_CATEGORY_ID[i18n.locale()];
                    }
                }
                /*
                theme: {
                    type: STRING,
                    defaultValue: DEFAULT.THEME
                }
                */
                // consider locale (for display of numbers, dates and currencies)
                // consider timezone (for display of dates), born (for searches)
            },
            fullName$: function () {
                return ((this.get('firstName') || '').trim() + ' ' + (this.get('lastName') || '').trim()).trim();
            },
            /**
             * Facebook
             * --------
             * Small:  https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/12509115_942778785793063_9199238178311708429_n.jpg?oh=af39b0956408500676ee12db7bf5ea31&oe=58B8E1A9
             * Large:  https://scontent.xx.fbcdn.net/v/t1.0-1/p160x160/12509115_942778785793063_9199238178311708429_n.jpg?oh=333006a975ce0fbebcd1ad7519f1bc45&oe=58CACE38
             * Larger: https://scontent.xx.fbcdn.net/t31.0-8/12487039_942778785793063_9199238178311708429_o.jpg
             * Small and large images cannot be accessed without query string but there is also https://graph.facebook.com/username_or_id/picture?width=9999
             *
             * Google
             * --------
             * Small: https://lh3.googleusercontent.com/-nma3Tmew9CI/AAAAAAAAAAI/AAAAAAAAAAA/AEMOYSCbFzy-DifyDo-I9xTQ6EUh8cQ4Xg/s64-c-mo/photo.jpg
             * Large: https://lh3.googleusercontent.com/-nma3Tmew9CI/AAAAAAAAAAI/AAAAAAAAAAA/AEMOYSCbFzy-DifyDo-I9xTQ6EUh8cQ4Xg/mo/photo.jpg
             *
             * Live
             * --------
             * Small: https://apis.live.net/v5.0/USER_ID/picture?type=small (96x96)
             * Medium: https://apis.live.net/v5.0/cid-bad501d98dfe21b3/picture?type=medium (160x160)
             * Large: https://apis.live.net/v5.0/USER_ID/picture?type=large (360x360)
             * If your user id is cid-bad501d98dfe21b3 use bad501d98dfe21b3 as USER_ID
             *
             * Twitter
             * --------
             * Small: https://pbs.twimg.com/profile_images/681812478876119042/UQ6KWVL8_normal.jpg
             * Large: https://pbs.twimg.com/profile_images/681812478876119042/UQ6KWVL8_400x400.jpg
             *
             */
            picture$: function () {
                var picture = this.get('picture');
                if ($.type(picture) === STRING && picture.length) {
                    return picture;
                } else {
                    return kendo.format(uris.mobile.icons, 'user');
                }
            },
            largerPicture$: function () {
                var that = this;
                var picture = that instanceof models.MobileUser ? that.get('picture') : that.picture;
                if ($.type(picture) === STRING && picture.length) {
                    return picture
                        .replace('/p50x50/', '/p160x160/') // Facebook
                        .replace('/s64-c-mo/', '/s160-c-mo/') // Google
                        .replace('?type=small', '?type=medium') // Live
                        .replace('_normal.', '_400x400.'); // Twitter
                } else {
                    return kendo.format(uris.mobile.icons, 'user');
                }
            },
            mobilePicture$: function () {
                var that = this;
                var picture = that instanceof models.MobileUser ? that.get('picture') : that.picture;
                var sid = that instanceof models.MobileUser ? that.get('sid') : that.sid;
                var persistent = fileSystem._persistent;
                // To have a mobile picture, there needs to have been a valid picture in the first place and a persistent file system to save it to
                if ($.type(persistent) !== UNDEFINED && RX_MONGODB_ID.test(sid) && $.type(picture) === STRING && picture.length) {
                    // Facebook, Google, Live and Twitter all use JPG images
                    // In the browser:
                    // - toURL returns a url starting with filesystem://
                    // - toInternalURL returns a url starting with cdvfile:// but the url scheme is not recognized by the browser
                    // On Android,
                    // - we get "Uncaught TypeError: FileSystem.encodeURIPath is not a function"
                    // On iOS
                    // - toURL returns a url starting with file://
                    // - toInternalURL returns a url starting with cdvfile://

                    // Note: cdvfile urls do not work in the browser and in WKWebViewEngine - https://issues.apache.org/jira/browse/CB-10141
                    // and the way to test WkWebView against UIWebView is to test window.indexedDB
                    var rootUrl = window.cordova && window.device && window.device.platform !== 'browser' && !window.indexedDB ?
                        persistent.root.toInternalURL() : persistent.root.toURL();
                    // var path = kendo.format(uris.mobile.pictures, persistent.root.toInternalURL(), sid + DOT_JPEG);
                    var path = kendo.format(uris.mobile.pictures, rootUrl, sid + DOT_JPEG);
                    logger.debug({
                        message: 'binding to mobilePicture$',
                        method: 'MobileUser.mobilePicture$',
                        data: { path: path }
                    });
                    return path;
                } else {
                    return kendo.format(uris.mobile.icons, 'user');
                }
            },
            /**
             * _saveMobilePicture should not be used directly
             * This is called from within MobileUserDataSource transport CRUD methods
             * @returns {*}
             * @private
             */
            _saveMobilePicture: function () {
                var that = this;
                var dfd = $.Deferred();
                // The following allows app.models.MobileUser.fn._saveMobilePicture.call(user) in MobileUserDataSource
                // where user is a plain object with a sid and picture
                var sid = that instanceof models.MobileUser ? that.get('sid') : that.sid;
                var remoteUrl = that instanceof models.MobileUser ? that.largerPicture$() : models.MobileUser.fn.largerPicture$.call(that);
                if (remoteUrl === kendo.format(uris.mobile.icons, 'user')) {
                    dfd.resolve();
                } else {
                    assert.match(RX_MONGODB_ID, sid, kendo.format(assert.messages.match.default, 'sid', RX_MONGODB_ID));
                    // Note: this may fail if user does not allow storage space
                    fileSystem.init()
                        .done(function () {
                            var directoryPath = kendo.format(uris.mobile.pictures, '', '');
                            var fileName = sid + DOT_JPEG;
                            fileSystem.getDirectoryEntry(directoryPath, window.PERSISTENT)
                                .done(function (directoryEntry) {
                                    fileSystem.getFileEntry(directoryEntry, fileName)
                                        .done(function (fileEntry) {
                                            fileSystem.download(remoteUrl, fileEntry)
                                                .done(dfd.resolve)
                                                .fail(dfd.reject);
                                        })
                                        .fail(dfd.reject);
                                })
                                .fail(dfd.reject);
                        })
                        .fail(dfd.reject);
                }
                return dfd.promise();
            },
            /**
             * Add a pin
             * @param pin
             */
            addPin: function (pin) {
                assert.type(STRING, pin, kendo.format(assert.messages.type.default, 'pin', STRING));
                assert.type(FUNCTION, md5, kendo.format(assert.messages.type.default, 'md5', FUNCTION));
                var salt = this.get('sid');
                assert.match(RX_MONGODB_ID, salt, kendo.format(assert.messages.match.default, 'salt', RX_MONGODB_ID));
                var md5pin = md5(salt + pin);
                this.set('md5pin', md5pin);
            },
            /**
             * Reset pin
             * @param pin
             */
            /*
            resetPin: function () {
                this.set('md5pin', null);
            },
            */
            /**
             * Verify pin
             * @param pin
             */
            verifyPin: function (pin) {
                assert.type(STRING, pin, kendo.format(assert.messages.type.default, 'pin', STRING));
                assert.type(FUNCTION, md5, kendo.format(assert.messages.type.default, 'md5', FUNCTION));
                var salt = this.get('sid');
                assert.match(RX_MONGODB_ID, salt, kendo.format(assert.messages.match.default, 'salt', RX_MONGODB_ID));
                var md5pin = md5(salt + pin);
                return this.get('md5pin') === md5pin;
            },
            /**
             * Load user from Kidoju-Server
             * @returns {*}
             */
            load: function () {
                var that = this;
                assert.ok(that.isNew(), 'Cannot load a new user into an existing user!');
                app.cache.removeMe();
                return app.cache.getMe()
                    .done(function (data) {
                        if ($.isPlainObject(data) && RX_MONGODB_ID.test(data.id)) {
                            // Since we have marked fields as non editable, we cannot use 'that.set',
                            // This should raise a change event on the parent viewModel
                            that.accept({
                                id: that.defaults.id,
                                sid: data.id,
                                firstName: data.firstName,
                                lastName: data.lastName,
                                lastSync: that.defaults.lastSync,
                                lastUse: new Date(),
                                md5pin: that.defaults.md5pin,
                                picture: data.picture,
                                rootCategoryId: that.defaults.rootCategoryId()
                            });
                        } else {
                            that.reset();
                        }
                    });

            },
            /**
             * Reset user
             */
            reset: function () {
                // Since we have marked fields as non editable, we cannot use 'that.set'
                this.accept({
                    id: this.defaults.id,
                    sid: this.defaults.sid,
                    firstName: this.defaults.firstName,
                    lastName: this.defaults.lastName,
                    lastSync: this.defaults.lastSync,
                    lastUse: this.defaults.lastUse,
                    md5pin: this.defaults.md5pin,
                    picture: this.defaults.picture,
                    rootCategoryId: this.defaults.rootCategoryId()
                });
            }
        });

        /**
         * MobileUserTransport transport
         */
        models.MobileUserTransport = Class.extend({

            /**
             * Validate user before saving
             * @param user
             */
            _validate: function (user) {
                var errors = [];
                if ($.type(user.md5pin) !== STRING) {
                    errors.push('Missing user pin');
                }
                return errors;
            },

            /**
             * Create transport
             * @param options
             * @returns {*}
             * @private
             */
            create: function (options) {
                assert.isPlainObject(options, kendo.format(assert.messages.isPlainObject.default, 'options'));
                assert.isPlainObject(options.data, kendo.format(assert.messages.isPlainObject.default, 'options.data'));
                logger.debug({
                    message: 'User data creation',
                    method: 'app.models.MobileUserDataSource.transport.create'
                });
                // Clean object to avoid DataCloneError: Failed to execute 'put' on 'IDBObjectStore': An object could not be cloned.
                var user = JSON.parse(JSON.stringify(options.data));
                var errors = this._validate(user);
                if (errors.length) {
                    return options.error.apply(this, ErrorXHR(new Error('Invalid user')));
                }
                // This replaces the machine id in the mongoDB server id by MACHINE_ID
                // This ensures uniqueness of user in mobile app when sid is unique without further checks
                // i.e. same user with the same sid recorded twice under different ids in mobile device
                user.id = new pongodb.ObjectId(user.sid).toMobileId();
                // Start with saving the picture to avoid a broken image in UI if user is saved without
                models.MobileUser.fn._saveMobilePicture.call(user)
                    .done(function () {
                        db.users.insert(user)
                            .done(function () {
                                options.success({ total: 1, data: [user] });
                            })
                            .fail(function (error) {
                                options.error.apply(this, ErrorXHR(error));
                            });
                })
                .fail(function (error) {
                    options.error.apply(this, ErrorXHR(error));
                });
            },

            /**
             * Destroy transport
             * @param options
             * @private
             */
            destroy: function (options) {
                assert.isPlainObject(options, kendo.format(assert.messages.isPlainObject.default, 'options'));
                assert.isPlainObject(options.data, kendo.format(assert.messages.isPlainObject.default, 'options.data'));
                logger.debug({
                    message: 'User data deletion',
                    method: 'app.models.MobileUserDataSource.transport.destroy'
                });
                var user = options.data;
                var id = user.id;
                if (RX_MONGODB_ID.test(id)) {
                    db.users.remove({ id: id })
                        .done(function (result) {
                            if (result && result.nRemoved === 1) {
                                options.success({ total: 1, data: [user] });
                            } else {
                                options.error.apply(this, ErrorXHR(new Error('User not found')));
                            }
                        })
                        .fail(function (error) {
                            options.error.apply(this, ErrorXHR(error));
                        });
                } else {
                    // No need to hit the database, it won't be found
                    options.error.apply(this, ErrorXHR(new Error('User not found')));
                }
            },

            /**
             * Read transport
             * @param options
             * @private
             */
            read: function (options) {
                logger.debug({
                    message: 'User data read',
                    method: 'app.models.MobileUserDataSource.transport.read'
                });
                // Initialize the file system for mobilePicture$
                fileSystem.init()
                .done(function () {
                    // Query the database of all users
                    db.users.find()
                        .done(function (result) {
                            if ($.isArray(result)) {
                                options.success({ total: result.length, data: result });
                            } else {
                                options.error.apply(this, ErrorXHR(new Error('Database should return an array')));
                            }
                        })
                        .fail(function (error) {
                            options.error.apply(this, ErrorXHR(error));
                        });
                })
                .fail(function (error) {
                    options.error.apply(this, ErrorXHR(error));
                });
            },

            /**
             * Update transport
             * @param options
             * @returns {*}
             * @private
             */
            update: function (options) {
                assert.isPlainObject(options, kendo.format(assert.messages.isPlainObject.default, 'options'));
                assert.isPlainObject(options.data, kendo.format(assert.messages.isPlainObject.default, 'options.data'));
                logger.debug({
                    message: 'User data update',
                    method: 'app.models.MobileUserDataSource.transport.update'
                });
                // Clean object to avoid DataCloneError: Failed to execute 'put' on 'IDBObjectStore': An object could not be cloned.
                var user = JSON.parse(JSON.stringify(options.data));
                var errors = this._validate(user);
                if (errors.length) {
                    return options.error.apply(this, ErrorXHR(new Error('Invalid user')));
                }
                var id = user.id;
                if (RX_MONGODB_ID.test(id)) {
                    // pongodb does not allow the id to be part of the update
                    user.id = undefined;
                    db.users.update({ id: id }, user)
                    .done(function (result) {
                        if (result && result.nMatched === 1 && result.nModified === 1) {
                            // Update the image from time to time
                            if (Math.floor(4 * Math.random()) === 0) {
                                // We discard success/failure because the user is saved
                                models.MobileUser.fn._saveMobilePicture.call(user);
                            }
                            // Restore id and return updated user to datasource
                            user.id = id;
                            options.success({ total: 1, data: [user] });
                        } else {
                            options.error.apply(this, ErrorXHR(new Error('User not found')));
                        }
                    })
                    .fail(function (error) {
                        options.error.apply(this, ErrorXHR(error));
                    });
                } else {
                    // No need to hit the database, it won't be found
                    options.error.apply(this, ErrorXHR(new Error('User not found')));
                }
            }

        });

        /**
         * MobileUserDataSource model (stored localy)
         * @type {kidoju.data.Model}
         */
        models.MobileUserDataSource = DataSource.extend({

            /**
             * Datasource constructor
             * @param options
             */
            init: function (options) {

                var that = this;

                DataSource.fn.init.call(that, $.extend(true, {}, {
                    transport: new models.MobileUserTransport(),
                    // no serverFiltering, serverSorting or serverPaging considering the limited number of users
                    schema: {
                        data: 'data',
                        total: 'total',
                        errors: 'error',
                        modelBase: models.MobileUser,
                        model: models.MobileUser
                        /**
                        // This is for debugging only
                        parse: function(response) {
                            // debugger;
                            return response;
                        }
                        */
                    }
                }, options));
            }

        });

        /**
         * An offline strategy using pongodb (and localForage)
         * @class OfflineStrategy
         */
        models.OfflineStrategy = kendo.Class.extend({

            /**
             * Initialization
             * @constructor
             */
            init: function (options) {
                this.remoteTransport = options.transport;
                this.collection = options.collection;
            },

            /**
             * Create a local item
             * @param options
             */
            create: function (options) {
                var result = options.data;
                debugger;
                var partition = this.remoteTransport._partition;
                result.id = kendo.guid();
                for (var prop in partition) {
                    if (partition.hasOwnProperty(prop)) {
                        result[prop] = partition[prop];
                    }
                }
                result.updated = new Date();
                result.__state__ = STATE.CREATED;
                localforage.setItem(result.id, result)
                .then(function () {
                    options.success({ total: 1, data: [result] });
                })
                .catch(function (err) {
                    options.error(err);
                });
            },

            /**
             * Destroy a local item
             * @param options
             */
            destroy: function (options) {
                var result = options.data;
                debugger;
                result.updated = new Date();
                result.__state__ = STATE.DESTROYED;
                localforage.setItem(result.id, result)
                .then(function () {
                    options.success({ total: 1, data: [result] });
                })
                .catch(function (err) {
                    options.error(err);
                });
            },

            /**
             * Read local items
             * @param options
             */
            read: function (options) {
                var result = [];
                debugger;
                var partition = this.remoteTransport._partition;
                debugger;
                // TODO sorting, filtering and paging
                localforage.iterate(function(value) {
                    if (value.__state__ !== STATE.DESTROYED) {
                        var include = true;
                        for (var prop in partition) {
                            if (partition.hasOwnProperty(prop) && value[prop] !== partition[prop]) {
                                include = false;
                                break;
                            }
                        }
                        if (include) {
                            result.push(value);
                        }
                    }
                }).then(function() {
                    options.success({ total: result.length, data: result });
                }).catch(function(err) {
                    options.error(err);
                });
            },

            /**
             * Update a local item
             * @param options
             */
            update: function (options) {
                var result = options.data;
                debugger;
                result.updated = new Date();
                if ($.type(result.__state__) === UNDEFINED) { // Especially if `created`
                    result.__state__ = STATE.UPDATED;
                }
                localforage.setItem(result.id, result)
                .then(function () {
                    options.success({ total: 1, data: [result] });
                })
                .catch(function (err) {
                    options.error(err);
                });
            },

            /**
             * Upload a created item
             * @param item
             * @private
             */
            _createSync: function (item) {
                var dfd = $.Deferred();
                // assert.equal(STATE.CREATED, item.__state__)
                delete item.__state__;
                debugger;
                var localId = item.id;
                item.id = null; // Note: We need a server id
                this.remoteTransport.create({
                    data: item,
                    error: function (err) {
                        // oops
                        debugger;
                        dfd.reject(err);
                    },
                    success: function (response) {
                        Promise.all([
                            localforage.removeItem(localId),
                            localforage.setItem(response.data[0].id, response.data[0])
                        ])
                        .then(dfd.resolve)
                        .catch(dfd.reject);
                    }
                });
                return dfd.promise();
            },

            /**
             * Upload a destroyed item
             * @param item
             * @private
             */
            _destroySync: function (item) {
                var dfd = $.Deferred();
                // assert.equal(STATE.DESTROYED, item.__state__)
                delete item.__state__;
                debugger;
                this.remoteTransport.destroy({
                    data: item,
                    error: function (err) {
                        if (err.message = '404') {
                            // If item is not found on the server, remove from local database
                            localforage.removeItem(item.id)
                            .then(dfd.resolve)
                            .catch(dfd.reject);
                        } else {
                            debugger;
                            dfd.reject(err);
                        }
                    },
                    success: function (response) {
                        localforage.removeItem(item.id)
                        .then(dfd.resolve)
                        .catch(dfd.reject);
                    }
                });
                return dfd.promise();
            },

            /**
             * Download remote items
             * @private
             */
            _readSync: function () {
                var dfd = $.Deferred();
                debugger;
                this.remoteTransport.read({
                    success: function (response) {
                        var result = response.data; // this.remoteTransport.read ensures data is already partitioned
                        var promises = [];
                        // TODO: we certainly have an issue with paging
                        for (var idx = 0, length = result.length; idx < length; idx++) {
                            promises.push(localforage.setItem(result[idx].id, result[idx])
                                .then(function () {
                                    dfd.notify({ pass: 2, index: idx, total: length});
                                })
                                .catch(function () {
                                    dfd.notify({ pass: 2, index: idx, total: length});
                                })
                            );
                        }
                        Promise.all(promises)
                        .then(dfd.resolve)
                        .catch(dfd.reject);
                    },
                    error: dfd.reject
                });
                return dfd.promise();
            },

            /**
             * Upload an updated item
             * @param item
             * @private
             */
            _updateSync: function (item) {
                var dfd = $.Deferred();
                debugger;
                // assert.equal(STATE.UPDATED, item.__state__)
                delete item.__state__;
                this.remoteTransport.update({
                    data: item,
                    error: function (err) {
                        debugger;
                        if (err.message = '404') {
                            // If item is not found on the server, remove from local database
                            localforage.removeItem(item.id)
                            .then(dfd.resolve)
                            .catch(dfd.reject);
                        } else {
                            debugger;
                            dfd.reject(err);
                        }
                    },
                    success: function (response) {
                        localforage.setItem(response.data[0].id, response.data[0])
                        .then(dfd.resolve)
                        .catch(dfd.reject);
                    }
                });
                return dfd.promise();
            },

            /**
             * Synchronize
             */
            synchronize: function () {
                var that = this;
                var dfd = $.Deferred();
                var partition = that.remoteTransport._partition;
                var promises = [];
                localforage.length()
                .then(function (total) {
                    localforage.iterate(function(value, key, index) {
                        var include = true;
                        for (var prop in partition) {
                            if (partition.hasOwnProperty(prop) && value[prop] !== partition[prop]) {
                                include = false;
                                break;
                            }
                        }
                        if (include) {
                            if (value.__state__ === STATE.CREATED) {
                                promises.push(that._createSync(value)
                                    .always(function () {
                                        dfd.notify({ pass: 1, index: index, total: total });
                                    })
                                );
                            } else if (value.__state__ === STATE.DESTROYED) {
                                promises.push(that._destroySync(value)
                                    .always(function () {
                                        dfd.notify({ pass: 1, index: index, total: total }); // TODO Add db table
                                    })
                                );
                            } else if (value.__state__ === STATE.UPDATED) {
                                promises.push(that._updateSync(value)
                                    .always(function () {
                                        dfd.notify({ pass: 1, index: index, total: total });
                                    })
                                );
                            } else {
                                total = (total - 1) || 1; // Should never be 0
                            }
                        }
                    }).then(function() {
                        $.when(promises)
                        .done(function () {
                            dfd.notify({ pass: 1, index: total - 1, total: total }); // Last index, we are done
                            that._readSync()
                            .progress(dfd.notify)
                            .done(dfd.resolve)
                            .fail(dfd.reject);
                        })
                        .fail(dfd.reject);
                    }).catch(dfd.reject);
                })
                .catch(dfd.reject);
                return dfd.promise();
            }
        });

        /**
         * MobileActivityTransport transport
         */
        models.MobileActivityTransport = Class.extend({

            /**
             * Init
             * @constructor
             * @param options
             */
            init: function(options) {
                this.setOptions(options || {});
            },

            /**
             * Set options
             * Note: calling setOptions on the transport requires calling read on the DataSource and possibly resetting filters, page size and sort order
             * @param options
             */
            setOptions: function(options) {
                this._language = options.language || i18n.locale();
                this._userId = options.userId || null;
            },

            /**
             * Validate that activity creation/update belongs here
             * @param activity
             * @private
             */
            _validate: function(activity) {
                var errors = [];
                var language = activity.version.language;
                if (!RX_LANGUAGE.test(language) || language !== this._language) {
                    errors.push('Language does not match.');
                }
                var userId = activity.actor.userId;
                if (!RX_MONGODB_ID.test(userId) || userId !== this._userId) {
                    errors.push('Cannot delegate the creation of activities.');
                }
                return errors;
            },

            /**
             * Create transport
             * @param options
             * @returns {*}
             * @private
             */
            create: function(options) {
                assert.isPlainObject(options, kendo.format(assert.messages.isPlainObject.default, 'options'));
                assert.isPlainObject(options.data, kendo.format(assert.messages.isPlainObject.default, 'options.data'));
                logger.debug({
                    message: 'Activity data creation',
                    method: 'app.models.MobileActivityDataSource.transport.create'
                });
                // Clean object to avoid DataCloneError: Failed to execute 'put' on 'IDBObjectStore': An object could not be cloned.
                var activity = JSON.parse(JSON.stringify(options.data));
                var errors = this._validate(activity); // TODO
                if (errors.length) {
                    return options.error.apply(this, ErrorXHR(new Error('Invalid activity')));
                }
                // The database will give us an id (but not a date)
                db.activities.insert(activity)
                    .done(function() {
                        options.success({total: 1, data: [activity]});
                    }).fail(function(error) {
                        options.error.apply(this, ErrorXHR(error));
                    });
            },

            /**
             * Destroy transport
             * @param options
             * @private
             */
            destroy: function(options) {
                assert.isPlainObject(options, kendo.format(assert.messages.isPlainObject.default, 'options'));
                assert.isPlainObject(options.data, kendo.format(assert.messages.isPlainObject.default, 'options.data'));
                logger.debug({
                    message: 'Activity data deletion',
                    method: 'app.models.MobileActivityDataSource.transport.destroy'
                });
                var activity = options.data;
                var id = activity.id;
                if (RX_MONGODB_ID.test(id)) {
                    db.activities.remove({ id: id })
                        .done(function(result) {
                            if (result && result.nRemoved === 1) {
                                options.success({total: 1, data: [activity]});
                            } else {
                                options.error.apply(this, ErrorXHR(new Error('Activity not found')));
                            }
                        }).fail(function(error) {
                            options.error.apply(this, ErrorXHR(error));
                        });
                } else {
                    // No need to hit the database, it won't be found
                    options.error.apply(this, ErrorXHR(new Error('Activity not found')));
                }
            },

            /**
             * Read transport
             * @param options
             * @private
             */
            read: function(options) {
                logger.debug({
                    message: 'Activity data read',
                    method: 'app.models.MobileActivityDataSource.transport.read'
                });
                if ($.type(this._userId) === NULL) {
                    // This lets us create a dataSource without knowing the userId, which can be set later with setOptions
                    options.success({ total: 0, data: [] });
                } else {
                    db.activities
                        .find({ 'version.language': this._language, 'actor.userId': this._userId }).done(function(result) {
                            if ($.isArray(result)) {
                                options.success({ total: result.length, data: result });
                            } else {
                                options.error.apply(this, ErrorXHR(new Error('Database should return an array')));
                            }
                        }).fail(function(error) {
                            options.error.apply(this, ErrorXHR(error));
                        });
                }
            },

            /**
             * Update transpoort
             * @param options
             * @returns {*}
             * @private
             */
            update: function(options) {
                assert.isPlainObject(options, kendo.format(assert.messages.isPlainObject.default, 'options'));
                assert.isPlainObject(options.data, kendo.format(assert.messages.isPlainObject.default, 'options.data'));
                logger.debug({
                    message: 'Activity data update',
                    method: 'app.models.MobileActivityDataSource.transport.update'
                });

                // Clean object to avoid DataCloneError: Failed to execute 'put' on 'IDBObjectStore': An object could not be cloned.
                var activity = JSON.parse(JSON.stringify(options.data));
                var errors = this._validate(activity);
                if (errors.length) {
                    return options.error.apply(this, ErrorXHR(new Error('Invalid activity')));
                }
                var id = activity.id;
                if (RX_MONGODB_ID.test(id)) {
                    activity.id = undefined;
                    // TODO: check userId?
                    db.activities.update({id: id}, activity).done(function(result) {
                        if (result && result.nMatched === 1 && result.nModified === 1) {
                            activity.id = id;
                            options.success({total: 1, data: [activity]});
                            // TODO serverSync if connected
                        } else {
                            options.error.apply(this, ErrorXHR(new Error('Activity not found')));
                        }
                    }).fail(function(error) {
                        options.error.apply(this, ErrorXHR(error));
                    });
                } else {
                    // No need to hit the database, it won't be found
                    options.error.apply(this, ErrorXHR(new Error('Activity not found')));
                }
            }

        });

        /**
         * MobileActivity model
         * @type {kidoju.data.Model}
         */
        models.MobileActivity = Model.define({
            id: 'id', // the identifier of the model, which is required for isNew() to work
            fields: {
                id: {
                    type: STRING,
                    nullable: true
                },
                // An activity without a sid does not exist on our servers
                sid: {
                    type: STRING,
                    nullable: true
                },
                actor: { // <--- models.UserReference
                    // For complex types, the recommendation is to leave the type undefined and set a default value
                    // See: http://www.telerik.com/forums/model---complex-model-with-nested-objects-or-list-of-objects
                    // See: http://demos.telerik.com/kendo-ui/grid/editing-custom
                    defaultValue: null,
                    parse: function (value) {
                        // Important: foreign keys use sids
                        return (value instanceof models.UserReference || value === null) ? value : new models.UserReference(value);
                    }
                },
                // score is used for activities of type score
                score: {
                    type: NUMBER,
                    editable: false,
                    nullable: true
                },
                // test is used for activities of type score
                test: {
                    // For complex types, the recommendation is to leave the type undefined and set a default value
                    defaultValue: null
                },
                type: {
                    type: STRING,
                    editable: false
                },
                updated: {
                    type: DATE
                },
                version: { // <--- models.VersionReference
                    // For complex types, the recommendation is to leave the type undefined and set a default value
                    // See: http://www.telerik.com/forums/model---complex-model-with-nested-objects-or-list-of-objects
                    // See: http://demos.telerik.com/kendo-ui/grid/editing-custom
                    defaultValue: null,
                    // TODO Add category!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    parse: function (value) {
                        // Important: foreign keys use sids
                        return (value instanceof models.VersionReference || value === null) ? value : new models.VersionReference(value);
                    }
                }
            },
            category$: function () {
                return ''; // TODO
            },
            period$: function () {
                // Time zones ????
                var now = new Date();
                var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                var yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
                var startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()); // Previous Sunday
                var startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // It won't show within a week of begining of the month
                var updated = this.get('updated');
                if (updated >= today) {
                    return today;
                } else if (updated >= yesterday) {
                    return yesterday;
                } else if (updated >= startOfWeek) {
                    return startOfWeek;
                } else if (updated >= startOfMonth) {
                    return startOfMonth;
                } else {
                    return new Date(updated.getFullYear(), updated.getMonth(), 1);
                }
            },
            title$: function () {
                return this.get('version.title'); // Flattens data depth
            },
            queryString$: function () {
                return '?language=' + window.encodeURIComponent(this.get('version.language')) +
                    '&summaryId=' + window.encodeURIComponent(this.get('version.summaryId')) +
                    '&versionId=' + window.encodeURIComponent(this.get('version.versionId')) +
                    '&activityId=' + window.encodeURIComponent(this.get('id'));
            }
            // TODO: See validateTestFromProperties in kidoju.data
            /**
            getScoreArray: function () {
                function matchPageConnectors (pageIdx) {
                    // Connectors are a match if they have the same solution
                    var ret = {};
                    var connectors = pageCollectionDataSource.at(pageIdx).components.data().filter(function (component) {
                        return component.tool === 'connector';
                    });
                    for (var i = 0, length = connectors.length; i < length; i++) {
                        var connector = connectors[i];
                        var name = connector.properties.name;
                        assert.match(RX_VALID_NAME, name, kendo.format(assert.messages.match.default, 'name', RX_VALID_NAME));
                        var solution = connector.properties.solution;
                        var found = false;
                        for (var prop in ret) {
                            if (ret.hasOwnProperty(prop)) {
                                if (prop === name) {
                                    // already processed
                                    found = true;
                                    break;
                                } else if (ret[prop] === solution) {
                                    // found matching connector, point to name
                                    ret[prop] = name;
                                    found = true;
                                    break;
                                }
                            }
                        }
                        if (!found) {
                            // Add first connector, waiting to find a matching one
                            ret[name] = solution;
                        }
                    }
                    return ret;
                }
                function matchConnectors () {
                    // We need a separate function because matching connectors neded to have the same solution on the same page (not a different page)
                    var ret = {};
                    for (var pageIdx = 0, pageTotal = pageCollectionDataSource.total(); pageIdx < pageTotal; pageIdx++) {
                        ret = $.extend(ret, matchPageConnectors(pageIdx));
                    }
                    return ret;
                }
                assert.instanceof(kendo.data.ObservableObject, this, kendo.format(assert.messages.instanceof.default, 'this', 'kendo.data.ObservableObject'));
                var that = this; // this is variable `result`
                var matchingConnectors = matchConnectors();
                var redundantConnectors = {};
                var scoreArray = [];
                for (var name in that) {
                    // Only display valid names in the form val_xxxxxx that are not redundant connectors
                    if (that.hasOwnProperty(name) && RX_VALID_NAME.test(name) && !redundantConnectors.hasOwnProperty(name)) {
                        var testItem = that.get(name);
                        var scoreItem = testItem.toJSON();
                        // Improved display of values in score grids
                        scoreItem.value = testItem.value$();
                        scoreItem.solution = testItem.solution$();
                        // Aggregate score of redundant items (connectors)
                        var redundantName = matchingConnectors[name];
                        if (that.hasOwnProperty(redundantName) && RX_VALID_NAME.test(redundantName)) {
                            // If there is a redundancy, adjust scores
                            var redundantItem = that.get(redundantName);
                            scoreItem.failure += redundantItem.failure;
                            scoreItem.omit += redundantItem.omit;
                            scoreItem.score += redundantItem.score;
                            scoreItem.success += redundantItem.success;
                            redundantConnectors[redundantName] = true;
                        }
                        scoreArray.push(scoreItem);
                    }
                }
                return scoreArray;
            },
            **/
        });

        /**
         * MobileActivityDataSource datasource (stored locally and synchronized)
         * @type {kidoju.data.DataSource}
         */
        models.MobileActivityDataSource = DataSource.extend({

            /**
             * Datasource constructor
             * @param options
             */
            init: function (options) {
                DataSource.fn.init.call(this, $.extend(true, {}, options, {
                    transport: new models.MobileActivityTransport({
                        language: options && options.language,
                        userId: options && options.userId
                    }),
                    serverAggregates: false,
                    serverFiltering: false,
                    serverGrouping: false,
                    serverSorting: false,
                    serverPaging: false,
                    group: {
                        dir: 'desc',
                        field: 'period$()'
                    },
                    sort: {
                        dir: 'desc',
                        field: 'updated'
                    },
                    schema: {
                        data: 'data',
                        errors: 'error', // <--------------------- TODO: look at this properly for error reporting
                        modelBase: models.MobileActivity,
                        model: models.MobileActivity,
                        total: 'total'
                        /**
                         // This is for debugging only
                         parse: function(response) {
                            // debugger;
                            return response;
                        }
                        */
                    }
                }, options));

            },

            /**
             * Synchronizes user activities with the server
             */
            remoteSync: function () {
                return this.transport.sync();
            }

        });

        /**
         * MobileVersion model
         * @type {kidoju.data.Model}
         */
        // models.MobileVersion = Model.define({});

        /**
         * MobileVersionDataSource datasource (stored localy)
         * @type {kidoju.data.Model}
         */
        // models.MobileVersionDataSource = DataSource.define({});

    }(window.jQuery));

    /* jshint +W074 */
    /* jshint +W071 */

    return window.app;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });
