/**
 * Copyright (c) 2013-2016 Memba Sarl. All rights reserved.
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
        './app.logger',
        './app.rapi',
        './app.cache',
        './app.db',
        './app.fs'
        // './app.models'
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
        var kendo = window.kendo;
        var kidoju = window.kidoju;
        var Model = kidoju.data.Model;
        var DataSource = kidoju.data.DataSource;
        var assert = window.assert;
        var logger = new window.Logger('app.mobile.models');
        var md5 = md5H || window.md5;
        var rapi = app.rapi;
        var models = app.models = app.models || {};
        var pongodb = window.pongodb;
        var db = app.db = new pongodb.Database({ name: 'KidojuDB', size: 5 * 1024 * 1024, collections: ['users'] });
        var i18n = app.i18n = app.i18n || {
                locale: function () { return 'en'; },
                culture: {
                    dateFormat: 'dd MMM yyyy',
                    languages: [
                        {
                            value: 'en',
                            name: 'English',
                            icon: ''
                        },
                        {
                            value: 'fr',
                            name: 'French',
                            icon: ''
                        }
                    ],
                    finder: {
                        treeview: {
                            rootNodes: {
                                home: {
                                    text: 'Home',
                                    icon: 'home'
                                },
                                favourites: {
                                    text: 'Favourites',
                                    icon: 'star'
                                },
                                categories: {
                                    text: 'Categories',
                                    icon: 'folders2'
                                }
                            }
                        }
                    },
                    versions: {
                        draft: {
                            name: 'Draft'
                        },
                        published: {
                            name: 'Version {0}'
                        }
                    }
                }
            };
        var uris = app.uris = app.uris || {}; // we expect to have app.uris.rapi = {...}
        uris.cdn = uris.cdn || {
                icons: 'https://cdn.kidoju.com/images/o_collection/svg/office/{0}.svg'
            };
        uris.mobile = {
            icons: './img/{0}.svg'
        };
        uris.webapp = uris.webapp  || { // this is for testing only
                editor      : window.location.protocol + '//' + window.location.host + '/{0}/e/{1}/{2}',
                finder      : window.location.protocol + '//' + window.location.host + '/{0}',
                player      : window.location.protocol + '//' + window.location.host + '/{0}/x/{1}/{2}',
                user        : window.location.protocol + '//' + window.location.host + '/{0}/u/{1}',
                summary     : window.location.protocol + '//' + window.location.host + '/{0}/s/{1}'
            };
        var DATE = 'date';
        var FUNCTION = 'function';
        var STRING = 'string';
        // var NUMBER = 'number';
        // var BOOLEAN = 'boolean';
        // var CHANGE = 'change';
        // var ITEMCHANGE = 'itemchange';
        var RX_MONGODB_ID = /^[a-z0-9]{24}$/;
        var DATE_0 = new Date(2000, 1, 1);
        var DOT = '.';
        // var HASHBANG = '#!';
        // var HOME = 'home';
        // var FAVOURITES = 'favourites';
        // var CATEGORIES = 'categories';
        // var VERSION_STATE = { DRAFT: 0, PUBLISHED: 5 };
        // var MD5_A = '0cc175b9c0f1b6a831c399e269772661';
        // The following allows FS_ROOT[window.TEMPORARY] and FS_ROOT[window.PERSISTENT];
        var FS_ROOT = ['cdvfile://localhost/temporary/', 'cdvfile://localhost/persistent/'];

        /**
         * MobileUser model (stored locally with PIN in SecureStorage)
         * We cannot use models.CurrentUser because of the complex storage model on mobile devices:
         * - Users stored in localForage database
         * - Pictures stored in Filesystem
         * - PINS stored in SecureStorage
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
                    editable: false,
                    nullable: false
                },
                firstName: {
                    type: STRING,
                    editable: false,
                    nullable: false
                },
                lastName: {
                    type: STRING,
                    editable: false,
                    nullable: false
                },
                // The current user is the user with the most recent lastUse
                lastUse: {
                    type: DATE,
                    editable: true,
                    nullable: false,
                    defaultValue: DATE_0
                },
                md5pin: {
                    type: STRING,
                    editable: true,
                    nullable: true
                },
                picture: {
                    type: STRING,
                    editable: false,
                    nullable: false
                }
                // consider locale (for display of numbers, dates and currencies)
                // consider timezone (for display of dates), born (for searches)
            },
            fullName$: function () {
                return ((this.get('firstName') || '').trim() + ' ' + (this.get('lastName') || '').trim()).trim();
            },
            picture$: function () {
                return this.get('picture') || kendo.format(uris.cdn.icons, 'user');
            },
            mobilePicture$: function () {
                // Note: we might want to check that this.picture$().split(DOT).pop() is a well known image extension
                return FS_ROOT[window.TEMPORARY] + 'users/' + this.get('id') + DOT + this.picture$().split(DOT).pop();
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
            resetPin: function () {
                this.set('md5pin', null);
            },
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
                return app.cache.getMe()
                    .done(function (data) {
                        if ($.isPlainObject(data) && RX_MONGODB_ID.test(data.id)) {
                            // Since we have marked fields as non editable, we cannot use 'that.set',
                            // This should raise a change event on the parent viewModel
                            that.accept({
                                sid: data.id,
                                firstName: data.firstName,
                                lastName: data.lastName,
                                lastUse: new Date(),
                                picture: data.picture
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
                    lastUse: this.default.lastUse,
                    md5pin: this.defaults.md5pin,
                    picture: this.defaults.picture
                });
            },
            /**
             * _saveMobilePicture should not be used directly
             * This is called from MobileUserDataSource
             * @returns {*}
             * @private
             */
            _saveMobilePicture: function () {
                var that = this;
                var dfd = $.Deferred();
                if (window.FileTransfer) {
                    var fileTransfer = new FileTransfer();
                    var source = window.encodeURI(this.picture$());
                    var target = this.mobilePicture$();
                    fileTransfer.download(
                        source,
                        target,
                        function (fileEntry) {
                            dfd.resolve(fileEntry);
                            logger.debug({
                                method: 'models.MobileUser.downloadPicture',
                                message: 'User picture successfully downloaded'

                            });
                            // Trigger the set event to reset data binding
                            that.trigger('set', { field: 'picture', value: that.get('picture') });
                        },
                        function (fileTransferError) {
                            dfd.reject(fileTransferError);
                            debugger;
                            logger.debug({
                                method: 'models.MobileUser.downloadPicture',
                                message: 'User picture failed to download',
                                error: fileTransferError
                            });
                        }
                    );
                } else {
                    dfd.reject(new Error('window.FileTransfer is missing.'));
                    logger.error({
                        method: 'models.MobileUser.downloadPicture',
                        message: 'window.FileTransfer is missing'
                    });
                }
                return dfd.promise();
            }
        });

        /**
         * MobileUserDataSource model (stored localy and sycnhronized)
         * @type {kidoju.data.Model}
         */
        models.MobileUserDataSource = DataSource.extend({

            /**
             * Datasource constructor
             * @param options
             */
            init: function (options) {

                var that = this;

                // Cache the userId from options
                that.userId = options && options.userId;

                DataSource.fn.init.call(that, $.extend(true, {}, {
                    transport: {
                        create: $.proxy(that._transport._create, that),
                        destroy: $.proxy(that._transport._destroy, that),
                        read: $.proxy(that._transport._read, that),
                        update: $.proxy(that._transport._update, that)
                    },
                    // serverFiltering: true,
                    // serverSorting: true,
                    // pageSize: 5,
                    // serverPaging: true,
                    schema: {
                        data: 'data',
                        total: 'total',
                        errors: 'error',
                        modelBase: models.MobileUser,
                        model: models.MobileUser
                        // parse: function (response) {
                        //     return response;
                        // }
                    }
                }, options));

            },

            /**
             * Datasource loader from local database
             * @param options
             * @returns {*}
             */
            load: function (options) {
                var that = this;
                that.userId = options && options.userId;
                return that.query(options);
            },

            /**
             * Setting _transport._read here with a reference above is a trick
             * so as to be able to replace this function in mockup scenarios
             */
            _transport: {
                _create: function (options) {
                    var that = this;
                    logger.debug({
                        message: 'User data creation',
                        method: 'app.models.MobileUserDataSource.transport.create'
                    });
                    var user = options.data;
                    if ($.type(user.md5pin) !== STRING) {
                        // Do not save a user without a pin
                        return options.error(undefined, 'error', 'Missing pin');
                    }
                    // This replaces the machine id in the mongoDB server id by MACHINE_ID
                    // This ensures uniqueness of user in mobile app when sid is unique without further checks
                    // i.e. same user with the same sid recorded twice under different ids in mobile device
                    user.id = new pongodb.ObjectId(user.sid).toMobileId();
                    user.lastUse = new Date();
                    db.users.insert(user)
                        .done(function  () {
                            // TODO save image
                            options.success(user);
                        })
                        .fail(options.error);
                },
                _destroy: function (options) {
                    var that = this;
                    logger.debug({
                        message: 'User data deletion',
                        method: 'app.models.MobileUserDataSource.transport.destroy'
                    });
                    if (options && options.data && RX_MONGODB_ID.test(options.data.id)) {
                        db.users.remove({ id: options.data.id })
                            .done(function (result) {
                                if (result && result.nRemoved === 1) {
                                    options.success(options.data);
                                } else {
                                    options.error(undefined, 'error', 'Failed to remove user from mobile database');
                                }
                            })
                            .fail(options.error);
                    } else {
                        options.error(undefined, 'error', 'Missing user id');
                    }
                },
                _read: function (options) {
                    var that = this;
                    logger.debug({
                        message: 'User data read',
                        method: 'app.models.MobileUserDataSource.transport.read'
                    });
                    db.users.find()
                        .done(function (result) {
                            if ($.isArray(result)) {
                                options.success({ total: result.length, data: result });
                            } else {
                                options.error(undefined, 'error', '`result` should be an `array`, possibly empty');
                            }
                        })
                        .fail(options.error);
                },
                _update: function (options) {
                    var that = this;
                    logger.debug({
                        message: 'User data update',
                        method: 'app.models.MobileUserDataSource.transport.update'
                    });
                    var user = options.data;
                    if (!RX_MONGODB_ID.test(user.id)) {
                        return options.error(undefined, 'error', 'Missing user id');
                    }
                    if ($.type(user.md5pin) !== STRING) {
                        // Do not save a user without a pin
                        return options.error(undefined, 'error', 'Missing pin');
                    }
                    var id = user.id;
                    user.id = undefined;
                    db.users.update({ id: id }, user)
                        .done(function (result) {
                            if (result && result.nMatched === 1 && result.nModified === 1) {
                                // TODO Save image
                                user.id = id;
                                options.success({ total: 1, data: user });
                            } else {
                                options.error(undefined, 'error', 'Failed to remove user from mobile database');
                            }
                        })
                        .fail(options.error);
                }
            }
        });

        /**
         * MobileVersion model (stored localy and sycnhronized)
         * @type {kidoju.data.Model}
         */
        models.MobileActivity = Model.define({
            // TODO
        });

        /**
         * MobileActivityDataSource datasource (stored localy and sycnhronized)
         * @type {kidoju.data.DataSource}
         */
        models.MobileActivityDataSource = DataSource.extend({
            // TODO
            init: function (options) {
                var that = this;
                DataSource.fn.init.call(that, options);
            }
        });

        /**
         * MobileVersion model (stored localy and sycnhronized)
         * @type {kidoju.data.Model}
         */
        // models.MobileVersion = Model.define({});

        /**
         * MobileVersion datasource (stored localy and sycnhronized)
         * @type {kidoju.data.Model}
         */
        // models.MobileVersionDataSource = DataSource.define({});

    }(window.jQuery));

    /* jshint +W074 */
    /* jshint +W071 */

    return window.app;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });
