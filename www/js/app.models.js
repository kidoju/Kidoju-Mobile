/**
 * Copyright (c) 2013-2014 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba/Kidoju-Platform
 */

/* jslint browser: true, jquery: true */
/* jshint browser: true, jquery: true */

;(function ($, undefined) {

    'use strict';

    var fn = Function,
        global = fn('return this')(),
        kendo = global.kendo,
        app = global.app = global.app || {},
        CONTENTS = 'contents',
        ACTIVITIES = 'activities',
        FUNCTION = 'function',
        CHANGE = 'change',

        MODULE = 'app.models.js: ',
        DEBUG = true;

    function log(message) {
        if (DEBUG && global.console && ($.type(global.console.log) === FUNCTION)) {
            global.console.log(MODULE + message);
        }
    }

    //ensure database
    app.db.open();

    var localContents = new kendo.data.DataSource({
        transport: {
            read: function(options) {
                var data = [];
                app.db.collection(CONTENTS).each(function(item){
                    data.push(item.value);
                }).done(function() {
                    options.success(data);
                }).fail(function(error) {
                    options.error(error);
                });
            }
        }
    });

    var localActivities = new kendo.data.DataSource({
        transport: {
            read: function(options) {
                var data = [];
                app.db.collection(ACTIVITIES).each(function(item){
                    data.push(item.value);
                }).done(function() {
                    options.success(data);
                }).fail(function(error) {
                    options.error(error);
                });
            }
        }
    });

    var remoteStorage = new kendo.data.DataSource({
        transport: {
            read: function(options) {
                app.rapi.v1.content.findSummaries().done(function(summaries){
                    options.success(summaries);
                }).fail(function(error) {
                    options.error(error);
                });
            }
            //see http://jsbin.com/azukin/4/edit
            //create
            //update
            //destroy
        }
        //schema
    });

    app.model = kendo.observable({
        message: {
            type: 0,
            text: null
        },
        settings: {
            user_id: null,
            user: null,
            language: null
        },
        //taxonomy
        languages: app.cultures.LANGUAGES,
        parent: null,
        //content
        search: '',
        remote: remoteStorage,
        contents: localContents,
        current: {},
        //activities
        activity: {},
        activities: localActivities,
        cacheDate: null,

        categories: function()  {
            var parent = app.model.get('parent');
            return [
                { _id: 0, parent: null, name: 'Category1' },
                { _id: 1, parent: null, name: 'Category2' },
                { _id: 2, parent: null, name: 'Catgeory3' }
            ];
        },

        /**
         * Cache profile and categories
         * TODO profile
         */
        cache: function() {
            if (global.localStorage) {
                //TODO: check cache date
                var language = app.model.get('settings.language') || 'en';
                app.rapi.taxonomy.getCategories(language).done(function (data) {
                    global.localStorage.setItem(language, JSON.stringify(data));
                    global.localStorage.setItem('cacheDate', Date.now());
                }).fail(function (error) {
                    //TODO
                });
            }
        },

        /**
         * Load model
         */
        load: function() {
            if (global.localStorage) {
                var language = app.model.get('settings.language') || 'en';
                global.localStorage.getItem(language);
            }
        },

        /**
         * Save changes to the model
         */
        save: function() {
            if (global.localStorage) {
                //global.localStorage.setItem();
            }
        },

        /**
         * Sync activities
         */
        sync: function() {

        }
    });

    app.model.bind(CHANGE, function(e) {
        log(e.field);
    });

    log('model initialized');

}(jQuery));