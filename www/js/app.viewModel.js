/**
 * Copyright (c) 2013-2014 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba/Kidoju-Platform
 */

/* jslint browser: true, jquery: true */
/* jshint browser: true, jquery: true */

;(function (win, $, undefined) {

    'use strict';

    var kendo = win.kendo,
        app = win.app = win.app || {},
        CONTENTS = 'contents',
        ACTIVITIES = 'activities',
        FUNCTION = 'function',
        CHANGE = 'change',

        MODULE = 'app.viewModel.js: ',
        DEBUG = true;

    /**
     * Log message to console
     * @param message
     */
    function log(message) {
        if (DEBUG && win.console && ($.type(win.console.log) === FUNCTION)) {
            win.console.log(MODULE + message);
        }
    }

    /**
     * Load user settings including user profile
     */
    function loadSettings() {

    }

    /**
     * Load categories
     */
    function loadCategories() {
        try {
            app.cache.getCategories(app.culture.LOCALE).done(function(data){
                var categories = viewModel.get('treeData')[1].items;
                if(!(categories instanceof kendo.data.ObservableArray)) {
                    throw new Error(); //TODO
                }
                data.unshift(0, categories.length);
                kendo.data.ObservableArray.prototype.splice.apply(categories, data);
            }).fail(function(error) {
                //TODO
            });
        } catch(ex) {
            //TODO
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

    var remoteContents = new kendo.data.DataSource({
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


    var viewModel = app.viewModel = kendo.observable({
        settings: {
            user_id: null,
            user: null,
            language: null
        },
        //taxonomy
        languages: app.culture.LANGUAGES,
        parent: null,
        categories: [],
        //contents
        search: '',
        remote: remoteContents,
        contents: localContents,
        current: {},
        //activities
        activities: localActivities,
        activity: {},

        /**
         * Load model
         */
        load: function() {
            loadSettings();
            loadCategories();
        },

        /**
         * Sync activities
         */
        sync: function() {

        }
    });

    viewModel.bind(CHANGE, function(e) {
        log(e.field);
    });

    viewModel.load();
    log('data loaded');

}(this, jQuery));