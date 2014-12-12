/**
 * Copyright (c) 2013-2014 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jslint browser: true, jquery: true */
/* jshint browser: true, jquery: true */

(function (window, $, undefined) {

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


    'use strict';

    var kendo = window.kendo,
        data = kendo.data,
        app = window.app = window.app || {},
        models = app.models = app.models || {},
        culture = app.culture = app.culture || { //this is for testing
            find: {
                TREE_DATA_HOME_ICON: 'home',
                TREE_DATA_HOME: 'Home',
                TREE_DATA_FAVOURITES_ICON: 'star',
                TREE_DATA_FAVOURITES: 'Favourites',
                TREE_DATA_CATEGORIES_ICON: 'folders2',
                TREE_DATA_CATEGORIES: 'Categories'
            },
            VERSIONS: {
                DRAFT: 'Draft',
                PUBLISHED: 'Version {0}'
            }
        },
        uris = app.uris = app.uris || { //this is for testing too
            cdn: {
                svg         : '/styles/images/o_collection/o_collection_svg/office/{0}.svg'
            },
            webapp: {
                user        : '/{0}/u/{1}',
                summary     : '/{0}/s/{1}'
            }
        },
        Model = data.Model,
        Node = data.Node,
        DataSource = data.DataSource,
        HierarchicalDataSource = data.HierarchicalDataSource,
        FUNCTION = 'function',
        OBJECT = 'object',
        STRING = 'string',
        NUMBER = 'number',
        DATE = 'date',
        DATE_FORMAT = culture.DATE_FORMAT || 'd',
        BOOLEAN = 'boolean',
        ERROR = 'error',
        CHANGE = 'change',
        SET = 'set',
        ITEMCHANGE = 'itemchange',
        MONGODB_ID_RX = /^[a-z0-9]{24}$/,
        FIELD_SPLIT = /\s|\,|\;/,
        LOCALE = (app.locale && $.type(app.locale.getValue) === FUNCTION) ? app.locale.getValue() : 'en',
        HASH = '#',
        HASHBANG = '#!',
        HOME = 'home',
        FAVOURITES = 'favourites',
        CATEGORIES = 'categories',
        VERSION_STATE = { DRAFT: 0, PUBLISHED: 5},

        DEBUG = app.DEBUG,
        MODULE = 'app.models.js: ';

    /**
     * Logs a message
     * @param message
     */
    function log(message) {
        if (DEBUG && window.console && (typeof window.console.log === FUNCTION)) {
            window.console.log(MODULE + message);
        }
    }

    /**
     * Split fields for save methods
     * @param fields
     * @returns {undefined}
     */
    function split(fields) {
        if ($.isArray(fields)) {
            return fields;
        } else if ($.type(fields) === STRING) {
            return fields.split(FIELD_SPLIT);
        } else if (fields !== undefined && $.type(fields.fields) === STRING) { // { fields: '.....' }
            return fields.fields.split(FIELD_SPLIT);
        } else {
            return undefined;
        }
    }

    /*
     //See kendo.date and kendo.timezone in kendo.core
     http://www.telerik.com/forums/undocumented-use-of-kendo-timezones
    function applyZone(date, fromZone, toZone) {
        if (toZone) {
            date = kendo.timezone.convert(date, fromZone, toZone);
        } else {
            date = kendo.timezone.remove(date, fromZone);
        }
        return date;
    }
    */

    /**
     * Returns an xhr object consistent with the xhr returned by the .fail method of $.ajax requests
     * @constructor
     */
    var ErrorXHR = function(status, message) {
            var errors = {
                '400': 'Bad Request',
                '401': 'Unauthorized',
                '404': 'Bad Request'
            };
            this.readyState = 4;
            this.responseText = kendo.format('{"error":{"name":"ApplicationError","code":0,"status":{0},"message":"{1}"}}', status, message);
            this.status = status;
            this.statusText = errors[status.toString()];
        };


    /******************************************************************
     * We first make fixes to the Kendo UI framework
     ******************************************************************/

    /**
     * BaseModel
     * @class
     */
    models.BaseModel = Model.define({
        init: function(data) {
            var that = this;
            //Parse data and convert to model field types
            //See http://www.telerik.com/forums/parsing-on-initialization-of-kendo-data-model
            /*
            if ($.type(data) === OBJECT) {
                $.each(Object.keys(data), function (index, key) {
                    if ($.type(that.fields[key]) === OBJECT) {
                        data[key] = that._parse(key, data[key]);
                    }
                });
            }
            */
            if ($.type(data) === OBJECT) {
                for (var field in data) {
                    if (data.hasOwnProperty(field)) {
                        if ($.type(that.fields[field]) === OBJECT) {
                            data[field] = that._parse(field, data[field]);
                        }
                    }
                }
            }
            //Call the base init method
            Model.fn.init.call(that, data);
        },
        accept: function(data) {
            var that = this;
            //Parse data and convert to model field types
            //See http://www.telerik.com/forums/parsing-on-initialization-of-kendo-data-model
            if ($.type(data) === OBJECT) {
                for (var field in data) {
                    if (data.hasOwnProperty(field)) {
                        if ($.type(that.fields[field]) === OBJECT) {
                            data[field] = that._parse(field, data[field]);
                        }
                    }
                }
            }
            //Call the base accept method
            Model.fn.accept.call(that, data);
            //Trigger a change event on the parent observable (possibly a viewModel)
            //See http://www.telerik.com/forums/triggering-a-change-event-on-the-parent-observable-when-calling-kendo-data-model-accept-method
            if ($.type(that.parent) === FUNCTION) {
                var observable = that.parent();
                if (observable instanceof kendo.Observable) {
                    /*
                    $.each(Object.keys(observable), function(index, key) {
                        if(observable[key] instanceof that.constructor && observable[key].uid === that.uid) { //we have found our nested object in the observable
                            observable.trigger(CHANGE, { field: key }); //otherwise UI won't be updated via MVVM
                            return false; //once we have found the key and triggered the change event, break out of iteration
                        }
                    });
                    */
                    for (var key in observable) {
                        if (observable.hasOwnProperty(key) && observable[key] instanceof that.constructor && observable[key].uid === that.uid) {//we have found our nested object in the observable
                            observable.trigger(CHANGE, { field: key }); //otherwise UI won't be updated via MVVM
                            return false; //once we have found the key and triggered the change event, break out of iteration
                        }
                    }
                }
            }
        },
        toPartialJSON: function(fields) {
            var that = this,
                partial,
                array = split(fields);
            if ($.isArray(array)) {
                $.each(array, function (index, field) {
                    if (that.fields[field] && that.editable(field)) {
                        if (!partial) {
                            partial = {};
                        }
                        partial[field] = that[field];
                    }
                });
            } else {
                partial = that.toJSON();
                for (var field in that.fields) {
                    if (that.fields.hasOwnProperty(field)) {
                        if (!that.editable(field)) {
                            delete partial[field];
                        }
                    }
                }
            }
            return partial;
        },
        validate: function() {
            var that = this, validated = true;
            for (var field in that.fields) {
                if(that.fields.hasOwnProperty(field)) {
                    var validation = that.fields[field].validation;
                    if ($.isPlainObject(validation)) {
                        if (validation.required === true && !that[field]) {
                            validated = false;
                        } else if (that[field]) {
                            if ($.type(validation.pattern) === STRING && !(new RegExp(validation.pattern)).test(that[field])) {
                                validated = false;
                            }
                            if ($.type(validation.min) === NUMBER && !isNaN(parseFloat(that[field])) && parseFloat(that[field]) < validation.min) {
                                validated = false;
                            }
                            if ($.type(validation.max) === NUMBER && !isNaN(parseFloat(that[field])) && parseFloat(that[field]) > validation.max) {
                                validated = false;
                            }
                        }
                    }
                }
            }
            return validated; //Should we return an array of errors instead???
        }
        //TODO
        //Consider a function that populates validation rules on forms
        //See http://docs.telerik.com/kendo-ui/framework/validator/overview
    });

    /*******************************************************************************
     * Taxonomy
     *******************************************************************************/

    /**
     * LazyCategory
     * A flattened readonly model for categories
     * @type {kendo.data.Model}
     */
    models.LazyCategory = models.BaseModel.define({
        id: 'id',
        fields: {
            id: {
                type: STRING,
                nullable: true,
                editable: false
            },
            icon: {
                type: STRING,
                editable: false
            },
            language: {
                type: STRING,
                editable: false
            },
            name: {
                type: STRING,
                editable: false
            },
            parentId: {
                type: STRING,
                nullable: true,
                editable: false
            }
        }
    });

    /**
     * LazyCategoryDataSource
     * A readonly datasource of categories
     * @type {kendo.data.DataSource}
     */
    models.LazyCategoryDataSource = DataSource.extend({
        init: function(options) {

            var that = this;

            DataSource.fn.init.call(that, $.extend(true, {}, {
                transport: {
                    read: $.proxy(that._transport._read, that)
                },
                schema: {
                    data: 'data',
                    total: 'total',
                    errors: 'error',
                    modelBase: models.LazyCategory,
                    model: models.LazyCategory
                }
            }, options));

        },
        /*
         * Setting _transport._read here with a reference above is a trick
         * so as to be able to replace this function in mockup scenarios
         */
        _transport: {
            _read: function(options) {
                app.cache.getAllCategories(LOCALE)
                    .done(function(response){
                        options.success(response);
                    })
                    .fail(function(xhr, status, error) {
                        options.error(xhr, status, error);
                    });
            }
        }
    });

    /*******************************************************************************
     * Searches and Rummages
     *******************************************************************************/

    /**
     * Search model
     * Note: Search is more about content than taxonomy, but saving a search adds to rummages
     * @type {models.BaseModel}
     */
    models.Search = models.BaseModel.define( {
        id: 'userId', // the identifier of the model
        fields: {
            userId: {
                type: STRING,
                nullable: true,
                editable : false
            },
            age: {
                type: NUMBER,
                nullable: true
            },
            author: {
                type: STRING
            },
            category: {
                type: STRING
            },
            favourite: {
                type: STRING
            },
            navbar: { //text search in navbar
                type: STRING
            },
            saveChecked: {
                type: BOOLEAN,
                defaultValue: false
            },
            sort: {
                type: STRING,
                defaultValue: 'd' //other possible values are 'r' and 'v' for dates, rates and views
            },
            text: { //text search
                type: STRING
            },
            type: { //text search
                type: NUMBER
            }
        },
        isSavable$: function() {
            return MONGODB_ID_RX.test(this.get('userId'));
        },
        //onChange event handler
        _onChange: function(e) {
            if (e.field === 'saveChecked' && !this.get('saveChecked')) {
                this.set('favourite', '');
            }
        },
        //Contructor
        init: function(data) {
            var that = this;
            models.BaseModel.fn.init.call(that, data);
            this.bind(CHANGE, $.proxy(that._onChange, that));
        },
        //get the hash - the hashchange event handler will actually trigger the search so that searches can be bookmarked as favourites
        getHash: function(advanced) {
            if (advanced) { //build hash from search panel
                var options = {
                    filter: {
                        logic : 'and',
                        filters: []
                    },
                    sort: []
                };

                //Filter
                var age = this.get('age');
                if ($.type(age) === NUMBER) {
                    options.filter.filters.push({field: 'minAge', operator: 'lte', value: age});
                    options.filter.filters.push({field: 'maxAge', operator: 'gte', value: age});
                }
                var author = this.get('author');
                if ($.type(author) === STRING && author.trim().length) {
                    options.filter.filters.push({field: 'author.lastName', operator: 'startswith', value: author.trim()});
                }
                var category = this.get('category');
                if(MONGODB_ID_RX.test(category)) {
                    options.filter.filters.push({field: 'categories', operator: 'eq', value: category});
                }
                var text = this.get('text');
                if ($.type(text) === STRING && text.trim().length) {
                    options.filter.filters.push({field: '$text', operator: 'eq', value: text.trim()});
                    //TODO: add language???
                }
                var type = this.get('type');
                if ($.type(type) === NUMBER) {
                    options.filter.filters.push({field: 'type', operator: 'eq', value: type});
                }

                //Sort
                var sort = this.get('sort');
                switch(sort) {
                    case 'v': //sort by number of views
                        //TODO
                        break;
                    case 'r': //sort by ratings

                        break;
                    case 'd': //sort by dates

                        break;
                }

                //Return hash
                return HASHBANG + $.param(options);

            } else { //build hash from navbar

                //Return hash - this is a different format that can be used for sitelink search snippet
                //https://developers.google.com/webmasters/richsnippets/sitelinkssearch
                return HASHBANG + 'q=' + encodeURIComponent(this.get('navbar').trim());
            }
        },
        load: function() {
            var that = this;
            return app.cache.getMe()
                .done(function(me){
                    //TODO in order to set a default age, we would need the date of birth
                    if($.isPlainObject(me) && MONGODB_ID_RX.test(me.id)) {
                        //Since we have marked fields as non editable, we cannot use 'that.set',
                        //This should raise a change event on the parent viewModel
                        that.accept({
                            userId: me.id
                        });
                    } else {
                        that.accept({
                            userId: null
                        });
                    }
                });
        },
        save: function() {
            //Test userId to avoid hitting the database unnecessarily
            if (MONGODB_ID_RX.test(this.userId)) {
                var favourite = {
                    name: this.get('favourite'),
                    path: this.getHash(true)
                };
                app.cache.removeMyFavourites(LOCALE);
                //Save a favourite on the current user
                return app.rapi.v1.user.createMyFavourite(LOCALE, favourite);
            } else {
                var dfd = $.Deferred();
                setTimeout(function() {
                    var xhr = new ErrorXHR(401, 'Ensure you have loaded the search model with an authenticated user id');
                    dfd.reject(xhr, ERROR, xhr.statusText);
                }, 0);
                return dfd.promise();
            }
        }
    });

    /**
     * Rummage model (displayed in treeview on find page)
     * @type {kendo.data.Model}
     */
    models.Rummage = Node.define({
        id: 'id',
        hasChildren: true,
        children: {
            schema: {
                data: 'items'
            }
        },
        fields: {
            id: {
                type: STRING,
                nullable: true,
                editable: false
            },
            name: {
                type: STRING,
                editable: false
            },
            icon: {
                type: STRING,
                editable: false
            },
            path: {
                type: STRING,
                nullable: true,
                editable: false
            },
            type: { // 0 = groups/folders, 1 = home, 2 = categories, 3 = favourites
                type: NUMBER,
                editable: false
            }
        },
        path$: function() {
            switch (this.get('type')) {
                case 1: //home
                    return HASH;
                case 2: //categories
                    return HASHBANG + $.param({filter:{field:'categories', operator:'eq', value:this.get('id')}});
                case 3: //favourites
                    var path = this.get('path');
                    if (/^https?:\/\//.test(path)) {
                        return path;
                    } else if (/^\//.test(path)) {
                        return path; //TODO: add protocol and host?
                    } else if (/^#/.test(path)) {
                        return path;
                    } else {
                        return HASH;
                    }
                    break;
                default: //including 0 (no hypertext link)
                    return null; //should not be used!!!
            }
        },
        icon$: function() {
            return kendo.format(uris.cdn.svg, this.get('icon'));
        }
    });

    // Children schema model cannot be set until the model exists
    // See http://www.telerik.com/forums/display-of-calculated-fields-in-treeview-template
    models.Rummage.prototype.children.schema.model = models.Rummage;
    //models.Rummage.prototype.children.schema.modelBase = models.Rummage;

    /**
     * Hierarchical datasource of rummages
     * @type {*|void}
     */
    models.RummageHierarchicalDataSource = HierarchicalDataSource.extend({
        init: function(options) {

            var that = this;

            HierarchicalDataSource.fn.init.call(that, $.extend(true, {}, {
                transport: {
                    read: $.proxy(that._transport._read, that),
                    delete: $.proxy(that._transport._delete, that)
                },
                schema: {
                    model: models.Rummage,
                    modelBase: models.Rummage
                }
            }, options));

        },
        _transport: {
            _read: function(options) {
                $.when(
                    app.cache.getFavouriteHierarchy(LOCALE),
                    app.cache.getCategoryHierarchy(LOCALE)
                )
                    .done(function(favourites, categories){
                        var rummages = [
                            { id: HOME, icon: culture.find.TREE_DATA_HOME_ICON, name: culture.find.TREE_DATA_HOME, type: 1 },
                            { id: FAVOURITES, icon: culture.find.TREE_DATA_FAVOURITES_ICON, name: culture.find.TREE_DATA_FAVOURITES, items: favourites, type: 0 },
                            { id: CATEGORIES, icon: culture.find.TREE_DATA_CATEGORIES_ICON, name: culture.find.TREE_DATA_CATEGORIES, items: categories, type: 0 }
                        ];
                        options.success(rummages);
                    })
                    .fail(function(xhr, status, error) {
                        options.error(xhr, status, error);
                    });
            },
            _delete: function(options) {
                $.noop(); //TODO with UI to check options
            }
        }
    });

    /************************************************************************************
     * Users
     ************************************************************************************/

    /**
     * UserReference Model
     * @class
     * @type {kendo.data.Model}
     */
    models.UserReference = models.BaseModel.define({
        id: 'userId', //the identifier of the model
        fields: {
            userId: {
                type: STRING,
                editable: false
            },
            firstName: {
                type: STRING,
                editable: false
            },
            lastName: {
                type: STRING,
                editable: false
            }
        }
    });

    /**
     * CurrentUser model
     * Minimal non-editable user to display in the navbar
     *
     * @type {kendo.data.Model}
     */
    models.CurrentUser = models.BaseModel.define( {
        id: 'id', // the identifier of the model
        fields: {
            id: {
                type: STRING,
                nullable: true, // a default value will not be assigned
                editable: false
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
            }
        },
        name$: function() {
            return ((this.get('firstName') || '').trim() + ' ' + (this.get('lastName') || '').trim()).trim();
        },
        picture$: function() {
            return this.get('picture') || kendo.format(uris.cdn.svg, 'user'); //TODO use font!!!!!
        },
        isAuthenticated$: function() {
            return MONGODB_ID_RX.test(this.get('id'));
        },
        uri$: function() {
            return kendo.format(uris.webapp.user, LOCALE, this.get('id'));
        },
        reset: function() {
            var that = this;
            //Since we have marked fields as non editable, we cannot use 'that.set'
            that.accept({
                id: null,
                firstName: '',
                lastName: '',
                picture: null
            });
        },
        load: function() {
            var that = this;
            return app.cache.getMe()
                .done(function(me){
                    if($.isPlainObject(me) && MONGODB_ID_RX.test(me.id)) {
                        //Since we have marked fields as non editable, we cannot use 'that.set',
                        //This should raise a change event on the parent viewModel
                        that.accept({
                            id: me.id,
                            firstName: me.firstName,
                            lastName: me.lastName,
                            picture: me.picture
                        });
                    } else {
                        that.reset();
                    }
                });
        }
    });

    /**
     * Account model
     * @type {kendo.data.Model}
     */
    models.Account = models.BaseModel.define({
        id: 'id', //the identifier of the model
        fields: {
            id: {
                type: STRING,
                nullable: true,
                editable: false
            },
            email: {
                type: STRING,
                editable: false
            },
            firstName: {
                type: STRING,
                editable: false
            },
            gender: {
                type: STRING,
                editable: false
            },
            lastName: {
                type: STRING,
                editable: false
            },
            link: {
                type: STRING,
                editable: false
            },
            locale:{
                type: STRING,
                editable: false
            },
            timezone: {
                type: STRING,
                editable: false
            },
            picture: {
                type: STRING,
                editable: false
            },
            updated: {
                type: DATE,
                nullable: true,
                editable: false
            },
            verified: {
                type: BOOLEAN,
                editable: false
            }
        }
    });

    /**
     * User model
     * @type {kendo.data.Model}
     */
    models.User = models.BaseModel.define({
        id: 'id', //the identifier of the model
        fields: {
            id: {
                type: STRING,
                editable: false
            },
            born: {
                type: DATE,
                nullable: true
            },
            created: {
                type: DATE,
                nullable: true,
                editable: false
            },
            description: {
                type: STRING
            },
            email: {
                type: STRING
            },
            firstName: {
                type: STRING
            },
            lastName: {
                type: STRING
            },
            //favourites
            language: {
                type: STRING
            },
            //metrics
            picture: {
                type: STRING
            },
            updated: {
                type: DATE,
                nullable: true,
                editable: false
            },
            //For complex types, the recommendation is to leave the type undefined and set a default value
            //See: http://www.telerik.com/forums/model---complex-model-with-nested-objects-or-list-of-objects
            //See: http://demos.telerik.com/kendo-ui/grid/editing-custom
            facebook: {
                defaultValue: null,
                editable: false,
                parse: function(value) {
                    //return $.isPlainObject(value) ? new models.Account(value) : null;
                    return (value instanceof models.Account || value === null) ? value : new models.Account(value);
                }
            },
            google: {
                defaultValue: null,
                editable: false,
                parse: function(value) {
                    return (value instanceof models.Account || value === null) ? value : new models.Account(value);
                }
            },
            twitter: {
                defaultValue: null,
                editable: false,
                parse: function(value) {
                    return (value instanceof models.Account || value === null) ? value : new models.Account(value);
                }
            },
            live: {
                defaultValue: null,
                editable: false,
                parse: function(value) {
                    return (value instanceof models.Account || value === null) ? value : new models.Account(value);
                }
            }
        },
        born$: function() {
            //TODO Timezones!!!
            return kendo.toString(this.get('born'), DATE_FORMAT);
        },
        created$: function() {
            return kendo.toString(this.get('created'), DATE_FORMAT);
        },
        emails$: function() {
            var emails = [],
                facebook = (this.get('facebook.email') || '').trim().toLowerCase(),
                google = (this.get('google.email') || '').trim().toLowerCase(),
                live = (this.get('live.email') || '').trim().toLowerCase(),
                twitter = (this.get('twitter.email') || '').trim().toLowerCase();
            if(facebook.length && emails.indexOf(facebook) === -1) {
                emails.push(facebook);
            }
            if(google.length && emails.indexOf(google) === -1) {
                emails.push(google);
            }
            if(live.length && emails.indexOf(live) === -1) {
                emails.push(live);
            }
            if(twitter.length && emails.indexOf(twitter) === -1) {
                emails.push(twitter);
            }
            return emails;
        },
        firstNames$: function() {
            var firstNames = [],
                facebook = (this.get('facebook.firstName') || '').trim(), //TODO Capitalize (camel case)
                google = (this.get('google.firstName') || '').trim(),
                live = (this.get('live.firstName') || '').trim(),
                twitter = (this.get('twitter.firstName') || '').trim();
            if(facebook.length && firstNames.indexOf(facebook) === -1) {
                firstNames.push(facebook);
            }
            if(google.length && firstNames.indexOf(google) === -1) {
                firstNames.push(google);
            }
            if(live.length && firstNames.indexOf(live) === -1) {
                firstNames.push(live);
            }
            if(twitter.length && firstNames.indexOf(twitter) === -1) {
                firstNames.push(twitter);
            }
            return firstNames;
        },
        lastNames$: function() {
            var lastNames = [],
                facebook = (this.get('facebook.lastName') || '').trim().toUpperCase(),
                google = (this.get('google.lastName') || '').trim().toUpperCase(),
                live = (this.get('live.lastName') || '').trim().toUpperCase(),
                twitter = (this.get('twitter.lastName') || '').trim().toUpperCase();
            if(facebook.length && lastNames.indexOf(facebook) === -1) {
                lastNames.push(facebook);
            }
            if(google.length && lastNames.indexOf(google) === -1) {
                lastNames.push(google);
            }
            if(live.length && lastNames.indexOf(live) === -1) {
                lastNames.push(live);
            }
            if(twitter.length && lastNames.indexOf(twitter) === -1) {
                lastNames.push(twitter);
            }
            return lastNames;
        },
        name$: function() {
            return ((this.get('firstName') || '').trim() + ' ' + (this.get('lastName') || '').trim()).trim();
        },
        picture$: function() {
            return this.get('picture') || kendo.format(uris.cdn.svg, 'user');
        },
        updated$: function() {
            return kendo.toString(this.get('updated'), DATE_FORMAT);
        },
        uri$: function() {
            return kendo.format(uris.webapp.user, LOCALE, this.get('id'));
        },
        load: function(data) {
            var that = this,
                dfd = $.Deferred();
            if (MONGODB_ID_RX.test(data)) { //data is a user id
                app.cache.getMe()
                    .done(function(me) {
                        if ($.isPlainObject(me) && data === me.id) { //the authenticated user requests his own profile
                            //Get the full profile including provider accounts
                            app.rapi.v1.user.getMe()
                                .done(function(user) {
                                    dfd.resolve(user);
                                })
                                .fail(function(xhr, status, error) {
                                    dfd.reject(xhr, status, error);
                                });
                        } else { //any user requests a public profile
                            //Get a public profile with limited information
                            app.rapi.v1.user.getUser(data)
                                .done(function(user) {
                                    dfd.resolve(user);
                                })
                                .fail(function(xhr, status, error) {
                                    dfd.reject(xhr, status, error);
                                });
                        }
                    })
                    .fail(function(xhr, status, error) {
                        dfd.reject(xhr, status, error);
                    });
            } else if ($.isPlainObject(data) && MONGODB_ID_RX.test(data.id)) { //data is a user object
                app.cache.getMe()
                    .done(function(me) {
                        if ($.isPlainObject(me) && data.id === me.id) { //the authenticated user requests his own profile
                            //Get the full profile including provider accounts
                            app.rapi.v1.user.getMe()
                                .done(function(user) {
                                    dfd.resolve(user);
                                })
                                .fail(function(xhr, status, error) {
                                    dfd.reject(xhr, status, error);
                                });
                        } else { //any user requests a public profile (which is not his)
                            //data is the public profile, no need for an other ajax call
                            setTimeout(function() {
                                dfd.resolve(data);
                            }, 0);
                        }
                    })
                    .fail(function(xhr, status, error) {
                        dfd.reject(xhr, status, error);
                    });
            } else {
                setTimeout(function() {
                    var xhr = new ErrorXHR(400, 'Unexpected data: please provide a user id or a plain object');
                    dfd.reject(xhr, ERROR, xhr.statusText);
                }, 0);
            }
            return dfd.promise().done(function(data) {
                that.accept(data);
            });
        },
        save: function(fields) {
            var that = this,
                dfd = $.Deferred();
            if (that.dirty) {
                var partial = that.toPartialJSON(fields);
                if (partial && !$.isEmptyObject(partial)) {
                    app.rapi.v1.user.updateMe(partial)
                        .done(function (user) {
                            //Note: user is not parsed, so dates are string
                            that.accept(user); //this updates dirty and updated
                            dfd.resolve(that);
                        })
                        .fail(function (xhr, status, error) {
                            dfd.reject(xhr, status, error);
                        });
                } else {
                    setTimeout(function () {
                        var xhr = new ErrorXHR(400, 'Fields to save do not designate any editable field');
                        dfd.reject(xhr, ERROR, xhr.statusText);
                    }, 0);
                }
            } else {
                setTimeout(function () {
                    dfd.resolve(); //nothing to save
                }, 0);
            }
            return dfd.promise();
        }

    });

    /*********************************************************************************
     * Contents
     *********************************************************************************/

    /**
     * New summary model
     * This model is essentially used by the create window in header.ejs
     * @type {kendo.data.Model}
     */
    models.NewSummary = models.BaseModel.define({
        id: 'id', // the identifier of the model
        fields: {
            id: {
                type: STRING,
                nullable: true,
                editable: false
            },
            author: {
                defaultValue: new models.UserReference(),
                parse: function(value) {
                    return (value instanceof models.UserReference || value === null) ? value : new models.UserReference(value);
                }
            },
            category: {
                nullable: true,
                parse: function(value) {
                    return (value instanceof models.LazyCategory || value === null) ? value : new models.LazyCategory(value);
                }
            },
            language: {
                type: STRING,
                defaultValue: LOCALE,
                editable: false,
                validation: {
                    required: true
                }
            },
            title: {
                type: STRING,
                validation: {
                    required: true,
                    pattern: '^\\S[^<>]{4,48}\\S$'
                }
            },
            type: {
                nullable: true,
                validation: {
                    required: true
                }
            }
        },
        author$: function() {
            return ((this.get('author.firstName') || '').trim() + ' ' + (this.get('author.lastName') || '').trim()).trim();
        },
        language$: function() {
            var locale = this.get('language'),
                languages = app.locale.getLanguages(locale);
            for (var i = 0; i < languages.length; i++) {
                if (languages[i].value === locale) {
                    return languages[i].name;
                }
            }
            return null ;
        },
        load: function() {
            var that = this;
            return app.cache.getMe()
                .done(function(me){
                    if($.isPlainObject(me) && MONGODB_ID_RX.test(me.id)) {
                        me.userId = me.id;
                        //delete me.picture;
                        that.set('author', new models.UserReference(me));
                        //that.set('language', LOCALE);
                    }
                });
        },
        reset: function() {
            var that = this;
            that.set('category', null);
            that.set('title', '');
            that.set('type', null);
        },
        save: function() {
            var that = this;
            //We could also have used toJSON and deleted any useless data
            var newSummary = {
                author: {
                    userId: that.get('author.userId')
                    //Let the server feed the authenticated user firstName and lastName from author.userId
                },
                //Make an array of categories and the server will use this category to set the default icon
                categories: [that.get('category.id')],
                language: that.get('language'),
                title: that.get('title'),
                type: that.get('type.value')
            };
            //Call server to create a new summary and return a promise
            return app.rapi.v1.content.createSummary(LOCALE, newSummary);
        }
    });

    /**
     * Lazy summary model (for lazy loading in lists)
     * @type {kendo.data.Model}
     */
    models.LazySummary = models.BaseModel.define({
        id: 'id', //the identifier of the model
        fields: {
            id: {
                type: STRING,
                nullable: true,
                editable: false
            },
            comments: {
                type: NUMBER,
                editable: false
            },
            created: {
                type: DATE,
                nullable: true,
                editable: false
            },
            firstName: {
                type: STRING,
                editable: false
            },
            lastName: {
                type: STRING,
                editable: false
            },
            icon: {
                type: STRING,
                editable: false
            },
            published: {
                type: DATE,
                editable: false
            },
            rating: {
                type: NUMBER,
                editable: false
            },
            score: {
                type: NUMBER,
                editable: false
            },
            tags: {
                //type: Array
                defaultValue: [],
                editable: false
            },
            title: {
                type: STRING,
                editable: false
            },
            updated: {
                type: DATE,
                nullable: true,
                editable: false
            },
            userId: {
                type: STRING,
                nullable: true,
                editable: false
            },
            views: {
                type: NUMBER,
                editable: false
            }
        },
        authorName$: function(){
            return ((this.get('firstName') || '').trim() + ' ' + (this.get('lastName') || '').trim()).trim();
        },
        authorUri$: function(){
            return kendo.format(uris.webapp.user, LOCALE, this.get('userId'));
        },
        created$: function() {
            return kendo.toString(this.get('created'), DATE_FORMAT);
        },
        icon$: function() {
            return kendo.format(uris.cdn.svg, this.get('icon'));
        },
        published$: function() {
            return kendo.toString(this.get('published'), DATE_FORMAT);
        },
        summaryUri$: function(){
            return kendo.format(uris.webapp.summary, LOCALE, this.get('id')) + (this.get('published') ? '' : '?draft=true') ;
        },
        tags$: function() {
            var ret = [], tags = this.get('tags');
            if (tags instanceof data.ObservableArray) {
                ret = tags.map(function(tag) {
                    return {
                        name: tag,
                        hash: HASHBANG + $.param({filter:{field:'tags', operator:'eq', value:tag}})
                    };
                });
            }
            return ret;
        },
        updated$: function() {
            return kendo.toString(this.get('updated'), DATE_FORMAT);
        }
    });

    /**
     * DataSource of Lazy summaries
     * @type {kendo.Observable}
     */
    models.LazySummaryDataSource = DataSource.extend({

        init: function(options) {

            var that = this;

            //Keep the userId defined in constructor's options
            that.userId = options && options.userId;

            DataSource.fn.init.call(that, $.extend(true, {}, {
                transport: {
                    read: $.proxy(that._transport._read, that)
                },
                serverFiltering: true,
                serverSorting: true,
                pageSize: 5,
                serverPaging: true,
                schema: {
                    data: 'data',
                    total: 'total',
                    errors: 'error',
                    modelBase: models.LazySummary,
                    model: models.LazySummary,
                    parse: function(response) {
                        //we parse the response to flatten data for our LazySummary model (instead of using field.from and field.defaultValue definitions)
                        if (response && $.type(response.total) === NUMBER && $.isArray(response.data)) {
                            $.each(response.data, function (index, summary) {
                                //Flatten author
                                summary.userId = summary.author && summary.author.userId || null;
                                summary.firstName = summary.author && summary.author.firstName || '';
                                summary.lastName = summary.author && summary.author.lastName || '';
                                if (summary.author) {
                                    delete summary.author;
                                }
                                //Flatten metrics
                                summary.comments = summary.metrics && summary.metrics.comments && summary.metrics.comments.count || 0;
                                summary.rating = summary.metrics && summary.metrics.ratings && summary.metrics.ratings.average || null;
                                summary.score = summary.metrics && summary.metrics.scores && summary.metrics.scores.average || null;
                                summary.views = summary.metrics && summary.metrics.views && summary.metrics.views.count || 0;
                                if (summary.metrics) {
                                    delete summary.metrics;
                                }
                            });
                        }
                        return response;
                    }
                }
            }, options));
        },
        load: function(options) {
            var that = this;
            that.userId = options && options.userId;
            return that.query(options);
            //return that.read();
        },
        /*
         * Setting _transport._read here with a reference above is a trick
         * so as to be able to replace this function in mockup scenarios
         */
        _transport: {
            _read: function(options) {

                var that = this;

                if (!MONGODB_ID_RX.test(that.userId)) { //Without user id, we just query public summaries

                    log('LazySummaryDataSource read without userId');

                    // add options.filter.filters.push({ field: 'language', operator: 'eq', value: LOCALE });
                    // ATTENTION logic and or or

                    options.data.fields = 'author,icon,metrics.comments.count,metrics.ratings.average,metrics.scores.average,metrics.views.count,published,tags,title,updated';
                    //TODO: Add default sort order

                    app.rapi.v1.content.findSummaries(LOCALE, options.data)
                        .done(function(summaries) {
                            options.success(summaries);
                        })
                        .fail(function(xhr, status, error) {
                            options.error(xhr, status, error);
                        });

                } else { //We have a userId and we want all summaries the author of which has such userId

                    app.cache.getMe()
                        .done(function(me) {

                            //options.data.fields = 'author,icon,metrics.comments.count,metrics.ratings.average,metrics.scores.average,metrics.views.count,published,tags,title,updated';
                            options.data.fields =          'icon,metrics.comments.count,metrics.ratings.average,metrics.scores.average,metrics.views.count,published,tags,title,updated';

                            // If the authenticated user is the author of summaries, include drafts
                            if ($.isPlainObject(me) && that.userId === me.id) {

                                log('LazySummaryDataSource read with userId set to authenticated user');

                                options.data.sort = [{ field: 'id', dir: 'desc' }];

                                app.rapi.v1.user.findMySummaries(LOCALE, options.data)
                                    .done(function (response) {
                                        options.success(response);
                                    })
                                    .fail(function(xhr, status, error) {
                                        options.error(xhr, status, error);
                                    });

                                // if the (authenticated/anonymous) user is not the author of summaries, only fetch public/published summaries
                            } else {

                                log('LazySummaryDataSource read with userId set to any user but authenticated user');

                                options.data.filter = {
                                    logic: 'and',
                                    filters: [
                                        {field: 'author.userId', operator: 'eq', value: that.userId}
                                    ]
                                };

                                options.data.sort = [{ field: 'published', dir: 'desc' }];

                                app.rapi.v1.content.findSummaries(LOCALE, options.data)
                                    .done(function (response) {
                                        options.success(response);
                                    })
                                    .fail(function(xhr, status, error) {
                                        options.error(xhr, status, error);
                                    });
                            }

                        })
                        .fail(function(xhr, status, error) {
                            options.error(xhr, status, error);
                        });
                }
            }
        }
    });

    /**
     * Summary model
     * @type {kendo.data.Model}
     */
    models.Summary = models.BaseModel.define({
        id: 'id', // the identifier of the model
        fields: {
            id: {
                type: STRING,
                editable: false
            },
            author: {
                //For complex types, the recommendation is to leave the type undefined and set a default value
                //See: http://www.telerik.com/forums/model---complex-model-with-nested-objects-or-list-of-objects
                //See: http://demos.telerik.com/kendo-ui/grid/editing-custom
                defaultValue: null,
                parse: function(value) {
                    return (value instanceof models.UserReference || value === null) ? value : new models.UserReference(value);
                }
            },
            categories: {
                defaultValue: []
            },
            created: {
                type: DATE,
                editable: false
            },
            description: {
                type: STRING
            },
            icon: {
                type: STRING,
                defaultValue: 'spacer'
            },
            language: {
                type: STRING
            },
            minAge: {
                type: NUMBER
            },
            maxAge: {
                type: NUMBER
            },
            metrics: {
                defaultValue: {},
                comments: {
                    count: {
                        type: NUMBER,
                        defaultValue: 0,
                        editable: false
                    }
                },
                ratings: {
                    average: {
                        type: NUMBER,
                        defaultValue: 0,
                        editable: false
                    }
                },
                views: {
                    count: {
                        type: NUMBER,
                        defaultValue: 0,
                        editable: false
                    }
                }
            },
            published: {
                type: DATE,
                nullable: true, //othervise defaultValue is now
                editable: false
            },
            tags: {
                defaultValue: []
            },
            title: {
                type: STRING
            },
            updated: {
                type: DATE,
                nullable: true, //othervise defaultValue is now
                editable: false
            }
        },
        categories$: function() {
            var that = this, ret = [];
            if($.type(that.parent) === FUNCTION) {
                var viewModel = that.parent();
                if (viewModel instanceof kendo.Observable) {
                    var ids = this.get('categories') || [],
                        categories = viewModel.get('categories'); //This supposes the parent viewModel as categories
                    if (categories instanceof models.LazyCategoryDataSource) {
                        categories = categories.data();
                        $.each(ids, function(index, id) {
                            var found = $.grep(categories, function(category) {
                                return category.id === id;
                            });
                            if(found.length) {
                                ret.push(found[0].name);
                            }
                        });
                    }
                }
            }
            return ret.join(', '); //TODO: sort
        },
        created$: function() {
            //TODO Timezones
            return kendo.toString(this.get('created'), DATE_FORMAT);
        },
        published$: function() {
            //TODO Timezones
            return kendo.toString(this.get('published'), DATE_FORMAT);
        },
        icon$: function() {
            return kendo.format(uris.cdn.svg, this.icon);
        },
        tags$: function() {
            return this.tags.join(', ');
        },
        updated$: function() {
            return kendo.toString(this.get('updated'), DATE_FORMAT);
        },
        init: function (data) {
            var that = this;
            models.BaseModel.fn.init.call(that, data);
            that.bind(CHANGE, $.proxy(that._onChange, that));
        },
        _onChange: function (e) {
            // call the base function
            data.Model.fn._notifyChange.call(this, e);
            // kendo only handles add/remove on arrays of child elements
            // set dirty when an itemchange occurs in an array, e.g. versions
            // See: http://blog.falafel.com/Blogs/JoshEastburn/josh-eastburn/2014/04/25/dirty-children-and-kendo-ui
            if (e.action === ITEMCHANGE) {
                this.dirty = true;
            }
        },
        load: function(data) {
            var that = this,
                dfd = $.Deferred();
            if (MONGODB_ID_RX.test(data)) { //data is a summary id
                log ('data is an id, make ajax call to server');
                app.rapi.v1.content.getSummary(LOCALE, data)
                    .done(function(summary) {
                        dfd.resolve(summary);
                    })
                    .fail(function(xhr, status, error) {
                        dfd.reject(xhr, status, error);
                    });
            } else if ($.isPlainObject(data) && MONGODB_ID_RX.test(data.id)) { //data is a summary object with a proper id
                if (data.published) { //data is a published summary, so it should be complete
                    log ('data is a published summary, no need to make an ajax call');
                    setTimeout(function() {
                        dfd.resolve(data);
                    }, 0);
                } else { //data is a draft summary, hence it is incomplete and we need an authenticated ajax call to fetch more data
                    log ('data is draft summary, make authenticated ajax call to server');
                    app.rapi.v1.content.getSummary(LOCALE, data.id)
                        .done(function(summary) {
                            dfd.resolve(summary);
                        })
                        .fail(function(xhr, status, error) {
                            dfd.reject(xhr, status, error);
                        });
                }
            } else {
                setTimeout(function() {
                    var xhr = new ErrorXHR(400, 'Unexpected data: please provide an id string or a plain object');
                    dfd.reject(xhr, ERROR, xhr.statusText);
                }, 0);
            }
            return dfd.promise().done(function(summary) {
                that.accept(summary);
            });
        },
        save: function(fields) {
            var that = this,
                dfd = $.Deferred();
            if (that.dirty) {
                var partial = that.toPartialJSON(fields);
                if (partial && !$.isEmptyObject(partial)) {
                    var language = that.get('language'),
                        id = that.get('id');
                    app.rapi.v1.content.updateSummary(language, id, partial)
                        .done(function (summary) {
                            //Note: summary is not parsed, so dates are string
                            that.accept(summary); //this updates dirty and updated
                            dfd.resolve(that);
                        })
                        .fail(function (xhr, status, error) {
                            dfd.reject(xhr, status, error);
                        });
                } else {
                    setTimeout(function () {
                        var xhr = new ErrorXHR(400, 'Fields to save do not designate any editable field');
                        dfd.reject(xhr, ERROR, xhr.statusText);
                    }, 0);
                }
            } else {
                setTimeout(function () {
                    dfd.resolve(); //nothing to save
                }, 0);
            }
            return dfd.promise();
        },
        createDraft: function() {
            return app.rapi.v1.content.executeCommand(this.get('language'), this.get('id'), {command: 'draft'});
        },
        publish: function() {
            return app.rapi.v1.content.executeCommand(this.get('language'), this.get('id'), {command: 'publish'});
        },
        rate: function(value) {
            //TODO: what if already rated?????
            //TODO: check that an author cannot rate is own summaries
            return app.rapi.v1.content.createSummaryActivity(this.get('language'), this.get('id'), { type: 'rating', value: value });
        }
    });

    /**
     * Lazy version
     * @type {kendo.data.Model}
     */
    models.LazyVersion = models.BaseModel.define({
        id: 'id',
        fields: {
            id: {
                type: STRING,
                nullable: true,
                editable: false
            },
            //created
            //language
            name: {
                type: STRING,
                editable: false
            },
            state: {
                type: NUMBER,
                editable: false
            },
            //stream
            summaryId: {
                type: STRING,
                nullable: true,
                editable: false
            }
            //type
            //updated
            //userId
        }
    });

    /**
     * Lazy version data source (especially for drop down list)
     * @type {*|void}
     */
    models.LazyVersionDataSource = DataSource.extend({

        init: function(options) {
            var that = this;

            that.summaryId = options && options.summaryId;

            DataSource.fn.init.call(that, $.extend(true, {}, {
                transport: {
                    read: $.proxy(that._transport._read, that)
                },
                serverFiltering: true,
                serverSorting: true,
                pageSize: 100, //
                serverPaging: true,
                schema: {
                    data: 'data',
                    total: 'total',
                    errors: 'error',
                    modelBase: models.LazyVersion,
                    model: models.LazyVersion,
                    parse: function(response) {
                        //Name versions: draft, version 1, version 2, ....
                        if (response && $.type(response.total === NUMBER && $.isArray(response.data))) {
                            $.each(response.data, function (index, version) {
                                if (version.state === VERSION_STATE.DRAFT) {
                                    version.name = app.culture.VERSIONS.DRAFT;
                                } else {
                                    version.name = kendo.format(app.culture.VERSIONS.PUBLISHED, response.data.length - index);
                                }
                            });
                        }
                        return response;
                    }
                }
            }, options));
        },
        load: function(options) {
            var that = this;
            that.summaryId = options && options.summaryId;
            return that.query(options);
            //return that.read();
        },
        /*
         * Setting _transport._read here with a reference above is a trick
         * so as to be able to replace this function in mockup scenarios
         */
        _transport: {
            _read: function (options) {

                var that = this;

                options.data.fields = 'state,summaryId';
                options.data.sort = { field: 'id', dir: 'desc'};

                app.rapi.v1.content.findSummaryVersions(LOCALE, that.summaryId, options.data)
                    .done(function(response) {
                        options.success(response);
                    })
                    .fail(function(xhr, error, status) {
                        options.error(xhr, error, status);
                    });
            }
        }

    });

    /**
     * Version reference in activities
     * @type {kendo.data.Model}
     */
    models.VersionReference = models.BaseModel.define({
        id: 'versionId',
        fields: {
            language: {
                type: STRING,
                editable: false
            },
            summaryId: {
                type: STRING,
                editable: false
            },
            title: {
                type: STRING,
                editable: false
            },
            versionId: {
                type: STRING,
                editable: false
            }
        }
    });

    /**
     * Version
     * @type {kendo.data.Model}
     */
    models.Version = models.BaseModel.define({
        id: 'id',
        fields: {
            id: {
                type: STRING,
                nullable: true,
                editable: false
            },
            created: {
                type: DATE,
                nullable: true,
                editable: false
            },
            language: {
                type: STRING,
                editable: false
            },
            state: {
                type: NUMBER,
                editable: false
            },
            stream: {
                defaultValue: null
                //TODO
            },
            summaryId: {
                type: STRING,
                nullable: true,
                editable: false
            },
            type: {
                type: NUMBER,
                editable: false
            },
            updated: {
                type: DATE,
                nullable: true,
                editable: false
            },
            userId: {
                type: STRING,
                nullable: true,
                editable: false
            }
        },
        created$: function() {
            return kendo.toString(this.get('created'), DATE_FORMAT);
        },
        updated$: function() {
            return kendo.toString(this.get('updated'), DATE_FORMAT);
        },
        load: function(data, versionId) {
            var that = this,
                dfd = $.Deferred();
            if (MONGODB_ID_RX.test(data) && MONGODB_ID_RX.test(versionId)) {
                app.rapi.v1.content.getSummaryVersion(LOCALE, data, versionId)
                    .done(function(version) {
                        dfd.resolve(version);
                    })
                    .fail(function(xhr, status, error) {
                        dfd.reject(xhr, status, error);
                    });
            } else if ($.isPlainObject(data) && MONGODB_ID_RX.test(data.id)) {
                //What if it is a draft and the userId is not the author???
                setTimeout(function() {
                    dfd.resolve(data);
                });
            } else {
                setTimeout(function() {
                    var xhr = new ErrorXHR(400, 'Unexpected data: please provide an id string and a versionId or a plain object');
                    dfd.reject(xhr, ERROR, xhr.statusText);
                }, 0);
            }
            return dfd.promise().done(function(version) {
                that.accept(version);
            });
        },
        save: function() {
            $.noop(); //TODO
        }
    });

    /**
     * Activity model
     * @type {kendo.data.Model}
     */
    models.LazyActivity = models.BaseModel.define({
        id: 'id',
        fields: {
            id: {
                type: STRING,
                nullable: true,
                editable: false
            },
            created: {
                type: DATE,
                nullable: true,
                editable: false
            },
            firstName: {
                type: STRING,
                editable: false
            },
            language: {
                type: STRING,
                editable: false
            },
            lastName: {
                type: STRING,
                editable: false
            },
            text: {
                type: STRING,
                nullable: true,
                editable: false
            },
            type: {
                type: STRING,
                editable: false
            },
            updated: {
                type: DATE,
                nullable: true,
                editable: false
            },
            summaryId: {
                type: STRING,
                nullable: true,
                editable: false
            },
            title: {
                type: STRING,
                editable: false
            },
            userId: {
                type: STRING,
                nullable: true,
                editable: false
            },
            versionId: {
                type: STRING,
                nullable: true,
                editable: false
            },
            value: {
                type: NUMBER,
                nullable: true,
                editable: false
            }
        },
        actorName$: function(){
            return ((this.get('firstName') || '').trim() + ' ' + (this.get('lastName') || '').trim()).trim();
        },
        actorUri$: function(){
            return kendo.format(uris.webapp.user, LOCALE, this.get('userId'));
        },
        created$: function() {
            return kendo.toString(this.get('created'),DATE_FORMAT);
        },
        icon$: function() {
            return '#'; //TODO
            //return kendo.format(uris.cdn.svg, this.get('icon'));
        },
        summaryUri$: function(){
            return kendo.format(uris.webapp.summary, LOCALE, this.get('id')); // + (this.get('published') ? '' : '?draft=true') ;
        },
        action$: function() {
            return 'commented'; //TODO
        },
        updated$: function() {
            return kendo.toString(this.get('updated'), DATE_FORMAT);
        }
    });

    /**
     * Datasource of user activities
     * @type {kendo.Observable}
     */
    models.LazyActivityDataSource = DataSource.extend({

        init: function(options) {
            var that = this;

            that.summaryId = options && options.summaryId;

            DataSource.fn.init.call(that, $.extend(true, {}, {
                transport: {
                    read: $.proxy(that._transport._read, that)
                },
                serverFiltering: true,
                serverSorting: true,
                pageSize: 5,
                serverPaging: true,
                schema: {
                    data: 'data',
                    total: 'total',
                    errors: 'error',
                    modelBase: models.LazyActivity,
                    model: models.LazyActivity,
                    parse: function(response) {
                        //we parse the response to flatten data for our LazyActivity model (instead of using field.from and field.defaultValue definitions)
                        if (response && $.type(response.total === NUMBER && $.isArray(response.data))) {
                            $.each(response.data, function (index, activity) {
                                //Flatten actor
                                activity.userId = activity.actor && activity.actor.userId || null;
                                activity.firstName = activity.actor && activity.actor.firstName || '';
                                activity.lastName = activity.actor && activity.actor.lastName || '';
                                if (activity.actor) {
                                    delete activity.actor;
                                }
                                //Flatten version
                                activity.language = activity.version && activity.version.language || LOCALE;
                                activity.summaryId = activity.version && activity.version.summaryId || null;
                                activity.title = activity.version && activity.version.title || '';
                                activity.versionId = activity.version && activity.version.versionId || null;
                                if (activity.version) {
                                    delete activity.version;
                                }
                            });
                        }
                        return response;
                    }
                }
            }, options));
        },
        load: function(options) {
            var that = this;
            that.summaryId = options && options.summaryId;
            return that.query(options);
            //return that.read();
        },
        /*
         * Setting _transport._read here with a reference above is a trick
         * so as to be able to replace this function in mockup scenarios
         */
        _transport: {
            _read: function(options) {

                var that = this;

                //If we have a summaryId for the content being displayed, we fetch summary activities
                if (MONGODB_ID_RX.test(that.summaryId)) {

                    //Note: we get value (rating, score), but not text (comment, report)
                    options.data.fields = 'actor,created,type,updated,value,version.versionId';

                    app.rapi.v1.content.findSummaryActivities(LOCALE, that.summaryId, options.data)
                        .done(function (response) {
                            options.success(response);
                        })
                        .fail(function(xhr, status, error) {
                            options.error(xhr, status, error);
                        });

                    // Without a summaryId, we need an authenticated user to fetch user activities
                } else {

                    //Note: we get value (rating, score), but not text (comment, report)
                    //options.data.fields = 'actor,created,type,updated,value,version';
                    options.data.fields =         'created,type,updated,value,version';

                    app.rapi.v1.user.findMyActivities(LOCALE, options.data)
                        .done(function (response) {
                            options.success(response);
                        })
                        .fail(function(xhr, status, error) {
                            options.error(xhr, status, error);
                        });
                }
            }
        }
    });

    /**
     * Activity model
     * @type {kendo.data.Model}
     */
    models.Activity = models.BaseModel.define({
        id: 'id',
        fields: {
            id: {
                type: STRING,
                nullable: true,
                editable: false
            },
            actor: { // <--- models.UserReference
                //For complex types, the recommendation is to leave the type undefined and set a default value
                //See: http://www.telerik.com/forums/model---complex-model-with-nested-objects-or-list-of-objects
                //See: http://demos.telerik.com/kendo-ui/grid/editing-custom
                defaultValue: null,
                parse: function(value) {
                    return (value instanceof models.UserReference || value === null) ? value : new models.UserReference(value);
                }
            },
            created: {
                type: DATE,
                nullable: true,
                editable: false
            },
            type: {
                type: STRING,
                editable: false
            },
            updated: {
                type: DATE,
                nullable: true,
                editable: false
            },
            version: {// <--- models.VersionReference
                //For complex types, the recommendation is to leave the type undefined and set a default value
                //See: http://www.telerik.com/forums/model---complex-model-with-nested-objects-or-list-of-objects
                //See: http://demos.telerik.com/kendo-ui/grid/editing-custom
                defaultValue: null,
                parse: function(value) {
                    return (value instanceof models.VersionReference || value === null) ? value : new models.VersionReference(value);
                }
            }
        },
        created$: function() {
            return kendo.toString(this.get('created'), DATE_FORMAT);
        },
        updated$: function() {
            return kendo.toString(this.get('updated'), DATE_FORMAT);
        },
        load: function(data) {
            $.noop(); //TODO
        },
        save: function() {
            $.noop(); //TODO
        }
    });

    /**
     * Comment model
     * @type {kendo.data.Model}
     */
    models.Comment = models.Activity.define({
        fields: {
            text: {
                type: STRING
            },
            //the authenticated user
            userId: {
                type: STRING,
                nullable: true,
                editable: false
            }
        },
        init: function(data) {
            var that = this;
            //Call the base init method
            models.BaseModel.fn.init.call(that, data);
            that.type = 'comment';
        },
        signature$: function() {
            var updated = this.get('updated'),
                fullname = ((this.get('actor.firstName') || '').trim() + ' ' + (this.get('actor.lastName') || '').trim()).trim();
            if (updated instanceof Date) {
                return kendo.format('{0} wrote on {1:g}', fullname, updated);
            } else {
                return kendo.format('{0} is writing...', fullname);
            }
        },
        isEditable$: function() {
            return this.get('actor.userId') === this.get('userId');
        }
    });

    /**
     * Datasource of comments
     * @type {kendo.Observable}
     */
    models.CommentDataSource = DataSource.extend({

        init: function(options) {
            var that = this;

            that.userId = options && options.userId; //the authenticated user
            that.summaryId = options && options.summaryId;

            DataSource.fn.init.call(that, $.extend(true, {}, {
                transport: {
                    create: $.proxy(that._transport._create, that),
                    destroy: $.proxy(that._transport._destroy, that),
                    read: $.proxy(that._transport._read, that),
                    update: $.proxy(that._transport._update, that)
                },
                serverFiltering: true,
                serverSorting: true,
                pageSize: 5,
                serverPaging: true,
                schema: {
                    data: function(response) {
                        //See: http://www.telerik.com/forums/transport-methods-and-ids-created-on-the-server
                        if (response && $.type(response.total) === NUMBER && $.isArray(response.data)) { //read list
                            return response.data;
                        } else { //create, update, delete
                            return response;
                        }
                    },
                    total: 'total',
                    errors: 'error',
                    modelBase: models.Comment,
                    model: models.Comment,
                    parse: function(response) {
                        //add userId of authenticated user
                        if (response) {
                            if ($.type(response.total) === NUMBER && $.isArray(response.data)) { //a read
                                $.each(response.data, function (index, comment) {
                                    comment.userId = that.userId;
                                });
                            } else { //a create or update
                                response.userId = that.userId;
                            }
                        }
                        return response;
                    }
                }
            }, options));
        },
        load: function(options) {
            var that = this;
            that.summaryId = options && options.summaryId;
            that.userId = options && options.userId;
            return that.query(options);
            //return that.read();
        },
        /*
         * Setting _transport._read here with a reference above is a trick
         * so as to be able to replace this function in mockup scenarios
         */
        _transport: {
            _create: function(options) {
                var that = this;
                app.rapi.v1.content.createSummaryActivity(
                    (options.data.version && options.data.version.language) || LOCALE,
                    (options.data.version && options.data.version.summaryId) || that.summaryId,
                    { type: 'comment', text: options.data.text }
                )
                    .done(function(response) {
                        options.success(response);
                    })
                    .fail(function(xhr, error, status) {
                        options.error(xhr, error, status);
                    });
            },
            _destroy: function(options) {
                var that = this;
                app.rapi.v1.content.deleteSummaryActivity(
                    options.data.version.language,
                    options.data.version.summaryId,
                    options.data.id
                )
                    .done(function(response) {
                        options.success(response);
                    })
                    .fail(function(xhr, error, status) {
                        options.error(xhr, error, status);
                    });
            },
            _read: function(options) {
                var that = this;
                if (MONGODB_ID_RX.test(that.summaryId)) { //If we have a summaryId for the content being displayed, we fetch summary activities
                    options.data.fields = 'actor,created,text,updated,version';
                    options.data.filter = { field: 'type', operator: 'eq', value: 'Comment' };
                    options.data.sort = { field: 'id', dir: 'desc' };
                    app.rapi.v1.content.findSummaryActivities(
                        LOCALE,
                        that.summaryId,
                        options.data
                    )
                        .done(function (response) {
                            options.success(response);
                        })
                        .fail(function(xhr, status, error) {
                            options.error(xhr, status, error);
                        });
                } else { //Otherwise we raise an error
                    var xhr = new ErrorXHR(400, 'You need to initialize the CommentDataSource with a summaryId.');
                    options.error(xhr, ERROR, xhr.statusText);
                }
            },
            _update: function(options) {
                app.rapi.v1.content.updateSummaryActivity(
                    options.data.version.language,
                    options.data.version.summaryId,
                    options.data.id,
                    { text: options.data.text }
                )
                    .done(function(response) {
                        options.success(response);
                    })
                    .fail(function(xhr, error, status) {
                        options.error(xhr, error, status);
                    });
            }
        }
    });


}(this, jQuery));
