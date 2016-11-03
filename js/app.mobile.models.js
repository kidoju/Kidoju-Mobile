/**
 * Copyright (c) 2013-2016 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true, jquery: true */
/* globals define: false */

(function (f, define) {
    'use strict';
    define([
        './vendor/kendo/kendo.core',
        './vendor/kendo/kendo.data',
        './window.assert',
        './window.logger',
        './app.logger',
        './app.rapi',
        './app.cache',
        './app.db',
        './app.fs',
        // './app.models',
        './app.secure',
        './kidoju.data',
        './kidoju.tools'
    ], f);
})(function (md5) {

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
        var Stream = kidoju.data.Stream;
        var Node = kendo.data.Node;
        var HierarchicalDataSource = kendo.data.HierarchicalDataSource;
        var assert = window.assert;
        var logger = new window.Logger('app.mobile.models');
        var rapi = app.rapi;
        var models = app.models = app.models || {};
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
        var STRING = 'string';
        // var NUMBER = 'number';
        // var DATE = 'date';
        // var BOOLEAN = 'boolean';
        // var CHANGE = 'change';
        // var ITEMCHANGE = 'itemchange';
        var RX_MONGODB_ID = /^[a-z0-9]{24}$/;
        var DOT = '.';
        // var HASHBANG = '#!';
        // var HOME = 'home';
        // var FAVOURITES = 'favourites';
        // var CATEGORIES = 'categories';
        // var VERSION_STATE = { DRAFT: 0, PUBLISHED: 5 };
        // var MD5_A = '0cc175b9c0f1b6a831c399e269772661';



        /**
         * MobileVersion model (stored localy and sycnhronized)
         * @type {kidoju.data.Model}
         */
        // models.MobileActivity = Model.define({});

        /**
         * MobileActivityDataSource datasource (stored localy and sycnhronized)
         * @type {kidoju.data.DataSource}
         */
        // models.MobileActivityDataSource = DataSource.define({});

        /**
         * MobileUser model (stored locally with PIN in SecureStorage)
         * @type {kidoju.data.Model}
         */
        models.MobileUser = Model.define({
            id: 'id', // the identifier of the model, which is required for isNew() to work
            fields: {
                id: {
                    type: STRING,
                    editable: false,
                    nullable: true
                },
                firstName: {
                    type: STRING,
                    editable: false
                },
                lastName: {
                    type: STRING,
                    editable: false
                },
                picture: {
                    type: STRING,
                    editable: false,
                    nullable: true
                },
                // timezone (for display of dates), born (for searches)
                pin: {
                    type: STRING,
                    editable: true,
                    nullable: false
                }
            },
            fullName$: function () {
                return ((this.get('firstName') || '').trim() + ' ' + (this.get('lastName') || '').trim()).trim();
            },
            picture$: function () {
                return this.get('picture') || kendo.format(uris.cdn.icons, 'user');
            },
            mobilePicture$: function () {
                // Note: we might want to check that we have a well known image extension
                return FILESYSTEM.PERSISTENT + 'users/' + this.get('id') + DOT + this.picture$().split(DOT).pop();
            },
            // isAuthenticated$: function () {
            //    return RX_MONGODB_ID.test(this.get('id'));
            // },
            // userUri$: function () {
            //     return kendo.format(uris.webapp.user, i18n.locale(), this.get('id'));
            // },
            reset: function () {
                // Since we have marked fields as non editable, we cannot use 'that.set'
                this.accept({
                    id: this.defaults.id,
                    firstName: this.defaults.firstName,
                    lastName: this.defaults.lastName,
                    picture: this.defaults.picture,
                    pin: this.defaults.pin
                });
            },
            load: function () {
                var that = this;
                return app.cache.getMe()
                    .done(function (data) {
                        if ($.isPlainObject(data) && RX_MONGODB_ID.test(data.id)) {
                            // Since we have marked fields as non editable, we cannot use 'that.set',
                            // This should raise a change event on the parent viewModel
                            that.accept({
                                id: data.id,
                                firstName: data.firstName,
                                lastName: data.lastName,
                                picture: data.picture,
                                pin: data.picture
                            });
                            that.downloadPicture();
                        } else {
                            that.reset();
                        }
                    });
            },
            downloadPicture: function () {
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
            },
            loadMobile: function () {

            },
            saveMobile: function () {
                debugger;
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
