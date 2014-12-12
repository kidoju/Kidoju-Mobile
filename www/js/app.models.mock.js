/**
 * Copyright (c) 2013-2014 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jslint browser: true, jquery: true */
/* jshint browser: true, jquery: true */

(function (window, $, undefined) {

    'use strict';

    var kendo = window.kendo,
        app = window.app = window.app || app,
        models = app.models,
        FUNCTION = 'function',
        STRING = 'string',
        MONGODB_ID_RX = /^[a-z0-9]{24}$/,
        LOCALE = (app.locale && $.type(app.locale.getValue) === FUNCTION) ? app.locale.getValue() : 'en',
        ERROR = 'error',
        BAD_REQUEST = 'Bad Request',
        NOT_FOUND = 'Not Found',
        UNAUTHORIZED = 'Unauthorized',

        DEBUG = true, //app.DEBUG,
        MODULE = 'app.models.mock.js: ';

    if (!models) {
        throw new Error('app.models.js is not loaded');
    }

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
     * Generate a random id of 24 hexadecimal characters (like MongoDB)
     * @returns {string}
     */
    function newId() {
        return 'xxx'.replace(/[x]/g, function(x) { return (Math.random().toString(16)+"000000000").substr(2,8); });
    }

    /**
     * Parses documents in JSON files exported from MongoDB
     * Especially handles id and date fields
     * @param value
     * @returns {*}
     */
    function parse(value) {
        for (var field in value) {
            if (value.hasOwnProperty(field)) {
                //if value is an ObjectId
                if ($.isPlainObject(value[field]) && $.type(value[field].$oid) === 'string') {
                    var id = value[field].$oid;
                    delete value[field];
                    value[field.replace(/_([^_]*)/, '$1')] = id;
                    //if value is a date
                } else if ($.isPlainObject(value[field]) && $.type(value[field].$date) === 'string') {
                    value[field] = kendo.parseDate(value[field].$date);
                    //if value is an object with nested values
                } else if ($.isPlainObject(value[field])) {
                    value[field] = parse(value[field]);
                }
                //if value is an array of values or a basic type (string, number, boolean), keep as is
            }
        }
        if ($.isPlainObject(value)) {
            if (!value.created && value.updated instanceof Date) {
                value.created = value.updated;
            }
            delete value.__v;
        }
        return value;
    }

    /**
     * Clone an object from database without metadata
     * @param obj
     * @returns {*|void}
     */
    function cloneWithoutDBMetaData(obj) {
        var ret = $.extend(true, {}, obj); //clone
        ret.id = ret.originalId;
        delete ret.objType;
        delete ret.originalId;
        delete ret.meta;
        return ret;
    }

    /**
     * Convert an object from DB to be used in deferred resolution
     * @param obj
     * @constructor
     */
    function convertFromDBtoResolve(obj) {
        var ret = cloneWithoutDBMetaData(obj);
        ret.created = ret.created.toISOString();
        ret.updated = ret.updated.toISOString();
        return ret;
    }

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


    /**
     * Mock app.cache.getMe to fetch the authenticated user from lokiJS in-memory database
     * @type {{getMe: Function}}
     */
    app.cache = {
        getMe: function() {
            var dfd = $.Deferred();
            setTimeout(function() {
                var token = window.localStorage.getItem('token'),
                    me = { id: null };
                if ($.type(token) === STRING) {
                    var access = JSON.parse(token).access_token;
                    var tokens = db.tokens.find({access: access});
                    if ($.isArray(tokens) && tokens.length) {
                        if (tokens[0] && MONGODB_ID_RX.test(tokens[0].userId)) {
                            var users = db.users.find({originalId: tokens[0].userId});
                            if ($.isArray(users) && users.length) {
                                me = {id: users[0].originalId, firstName: users[0].firstName, lastName: users[0].lastName, picture: users[0].picture};
                            }
                        }
                    }
                }
                dfd.resolve(me);
            }, 0);
            return dfd.promise();
        },
        getAllCategories: function(locale) {
            var dfd = $.Deferred();
            setTimeout(function() {
                var categories = db.categories.find({ language: LOCALE });
                dfd.resolve({ total: categories.length, data: categories });
            }, 0);
            return dfd.promise();
        },
        getCategoryHierarchy: function(locale) {
            var dfd = $.Deferred();
            this.getAllCategories(locale)
                .done(function(response){
                    var hash = {};
                    $.each(response.data, function (index, value) {
                        //See http://docs.telerik.com/kendo-ui/getting-started/web/treeview/overview#item-definition
                        //See http://docs.telerik.com/kendo-ui/getting-started/web/treeview/binding-to-flat-data#method-1-initial-pre-processing-of-all-data
                        var item = {
                                id: value.id,
                                name: value.name,
                                icon: value.icon,
                                type: 2
                            },
                            id = value.id,
                            parentId = value.parentId || 'root';
                        hash[id] = hash[id] || [];
                        hash[parentId] = hash[parentId] || [];
                        item.items = hash[id];
                        hash[parentId].push(item);
                    });
                    dfd.resolve(hash.root);
                })
                .fail(function(xhr, status, error){
                    dfd.reject(xhr, status, error);
                });
            return dfd.promise();
        },
        getFavouriteHierarchy: function(locale) {
            var dfd = $.Deferred();
            setTimeout(function() {
                var token = window.localStorage.getItem('token'),
                    favourites = [];
                if ($.type(token) === STRING) {
                    var access = JSON.parse(token).access_token;
                    var tokens = db.tokens.find({access: access});
                    if ($.isArray(tokens) && tokens.length) {
                        if (tokens[0] && MONGODB_ID_RX.test(tokens[0].userId)) {
                            var users = db.users.find({originalId: tokens[0].userId});
                            if ($.isArray(users) && users.length) {
                                favourites = $.grep(users[0].favourites, function(favourite) {
                                    return favourite.language === locale;
                                });
                                $.each(favourites, function(index, favourite) {
                                    delete favourite.language;
                                    favourite.icon = 'star';
                                    favourite.type = 3;
                                });
                            }
                        }
                    }
                }
                dfd.resolve(favourites);
            }, 0);
            return dfd.promise();
        },
        removeMyFavourites: function(locale) {
            if(window.localStorage) {
                window.localStorage.removeItem('favourites.' + locale);
            }
        }
    };

    /*******************************************************************************
     * Taxonomy
     *******************************************************************************/

    /************************************************************************************
     * Searches and Rummages
     ************************************************************************************/

    models.Search.prototype.save = function() {
        var that = this,
            dfd = $.Deferred();
        //Test userId to avoid hitting the database unnecessarily
        if (MONGODB_ID_RX.test(this.userId)) {
            app.cache.removeMyFavourites(LOCALE);
            //Save a favourite on the current user
            setTimeout(function() {
                var favourite = {
                        id: newId(),
                        language: LOCALE,
                        name: that.get('favourite'),
                        path: that.getHash(true)
                    },
                    users = db.users.find({originalId: that.get('userId')});
                if ($.isArray(users) && users.length) {
                    var user = $.extend(true, {}, users[0]); //clone
                    user.favourites.push(favourite);
                    if (user.updated instanceof Date) {
                        that.updated = user.updated = new Date();
                    }
                    db.users.update(user);
                    dfd.resolve(favourite);
                } else {
                    var xhr = new ErrorXHR(404, 'User not found');
                    dfd.reject(xhr, ERROR, xhr.statusText);
                }
            }, 0);
        } else {
            setTimeout(function() {
                var xhr = new ErrorXHR(401, 'Ensure you have loaded the search model with an authenticated user id');
                dfd.reject(xhr, ERROR, xhr.statusText);
            }, 0);
        }
        return dfd.promise();
    };

    /************************************************************************************
     * Users
     ************************************************************************************/

    /**
     * Mock User.load function
     * @param data
     * @returns {*}
     */
    models.User.prototype.load = function(data) {
        var that = this, xhr,
            dfd = $.Deferred();
        if (MONGODB_ID_RX.test(data)) {
            var users = db.users.find({originalId: data});
            if ($.isArray(users) && users.length) {
                var user = $.extend(true, {}, users[0]); //clone
                app.cache.getMe()
                    .done(function(me) {
                        if (user.id !== me.id) {
                            user = filter(user, 'created,firstName,lastName,metrics.comments.count,metrics.ratings.average,metrics.summaries.count,picture,updated');
                            delete user.facebook; //our filter above always keeps ids even in subdocuments
                            delete user.google;
                            delete user.live;
                            delete user.twitter;
                        }
                        that.accept(user);
                        dfd.resolve(that);
                    });
            } else {
                xhr = new ErrorXHR(404, 'User not found');
                dfd.reject(xhr, ERROR, xhr.statusText);
            }
        } else if ($.isPlainObject(data) && MONGODB_ID_RX.test(data.id)) {
            that.accept(data);
            dfd.resolve(that);
        } else {
            xhr = new ErrorXHR(400, 'Unexpected data: please provide a plain object with an id property');
            dfd.reject(xhr, ERROR, xhr.statusText);
        }
        return dfd.promise();
    };

    /**
     * Mock User.save function
     * @returns {*}
     */
    models.User.prototype.save = function(/*fields*/) {
        var that = this, xhr,
            dfd = $.Deferred(),
            users = db.users.find({originalId: that.id}),
            update = {};
        if ($.isArray(users) && users.length) {
            var user = $.extend(true, {}, users[0]); //clone
            app.cache.getMe()
                .done(function(me) {
                    if ($.isPlainObject(me) && user.originalId === me.id) {
                        for (var field in that.fields) {
                            if (field !== 'id' && that.fields.hasOwnProperty(field) && that.editable(field)) {
                                //TODO: use toJSON?
                                update[field] = that.get(field);
                            }
                        }
                        $.extend(true, user, update);
                        if (user.updated instanceof Date) {
                            that.updated = user.updated = new Date();
                        }
                        db.users.update(user);
                        that.dirty = false;
                        dfd.resolve(that);
                    } else {
                        xhr = new ErrorXHR(401, 'Not authorized to save user');
                        dfd.reject(xhr, ERROR, xhr.statusText);
                    }
                });
        } else {
            xhr = new ErrorXHR(404, 'User not found');
            dfd.reject(xhr, ERROR, xhr.statusText);
        }
        return dfd.promise();
    };

    /************************************************************************************
     * Content
     ************************************************************************************/

    /**
     * Mock NewSummary.save function
     */
    models.NewSummary.prototype.save = function() {
        var that = this,
            dfd = $.Deferred(),
            xhr, now = new Date();
        app.cache.getMe()
            .done(function(me) {
                if ($.isPlainObject(me) && MONGODB_ID_RX.test(me.id)) {
                    if (!that.validate()) {
                        xhr = new ErrorXHR(400, 'Invalid data');
                        dfd.reject(xhr, ERROR, xhr.statusText);
                    } else {
                        var newSummary = {
                            id: newId(),
                            author: {
                                userId: me.id,
                                firstName: me.firstName,
                                lastName: me.lastName
                            },
                            categories: [that.get('category.id')],
                            created: now,
                            icon: that.get('category.icon'),
                            language: that.get('language'),
                            maxAge: 99,
                            minAge: 0,
                            tags: [],
                            title: that.get('title'),
                            type: that.get('type.value'),
                            updated: now
                        };
                        db.summaries.insert(newSummary);
                        dfd.resolve(convertFromDBtoResolve(newSummary));
                    }
                } else {
                    xhr = new ErrorXHR(401, 'Cannot save summary without being authenticated');
                    dfd.reject(xhr, ERROR, xhr.statusText);
                }
            });
        return dfd.promise();
    };

    /**
     * Mock LazySummaryDataSource transport.read function
     * @param options
     * @private
     */
    models.LazySummaryDataSource.fn._transport._read = function(options) {
        var that = this, fields, summaries, data = [], i;

        // TODO options.data.filter?
        // TODO options.data.sort?

        if (!MONGODB_ID_RX.test(that.userId)) { //Without user id, we just query public summaries

            log('LazySummaryDataSource read without userId');

            options.data.fields = 'created,author,icon,metrics.comments.count,metrics.ratings.average,metrics.scores.average,metrics.views.count,published,tags,title,updated';

            summaries = db.summaries.find({language: LOCALE});

            for (i = Math.max(0, (options.data.page - 1) * options.data.pageSize); i < Math.min(summaries.length, options.data.page * options.data.pageSize); i++) {
                data.push(filter(summaries[i], options.data.fields));
            }
            options.success({total: summaries.length, data: data });

        } else { //We have a userId and we want all summaries the author of which has such userId

            app.cache.getMe()
                .done(function(me) {

                    //options.data.fields = 'created,author,icon,metrics.comments.count,metrics.ratings.average,metrics.scores.average,metrics.views.count,published,tags,title,updated';
                    options.data.fields = 'created,icon,metrics.comments.count,metrics.ratings.average,metrics.scores.average,metrics.views.count,published,tags,title,updated';

                    // If the authenticated user is the author of summaries, include drafts
                    if ($.isPlainObject(me) && that.userId === me.id) {

                        log('LazySummaryDataSource read with userId set to authenticated user');

                        summaries = db.summaries.chain()
                            .find({'author.userId': that.userId})
                            .where(function(doc) { return doc.language === LOCALE; })
                            .data();

                        for (i = Math.max(0, (options.data.page - 1) * options.data.pageSize); i < Math.min(summaries.length, options.data.page * options.data.pageSize); i++) {
                            data.push(filter(summaries[i], options.data.fields));
                        }
                        options.success({total: summaries.length, data: data });

                        // if the (authenticated/anonymous) user is not the author of summaries, only fetch public/published summaries
                    } else {

                        log('LazySummaryDataSource read with userId set to any user but authenticated user');

                        summaries = db.summaries.chain()
                            .find({'author.userId': that.userId})
                            .where(function(doc) { return doc.language === LOCALE && doc.published instanceof Date; })
                            .data();

                        for (i = Math.min(0, (options.data.page - 1) * options.data.pageSize); i < Math.max(summaries.length, options.data.page * options.data.pageSize); i++) {
                            data.push(filter(summaries[i], options.data.fields));
                        }
                        options.success({total: summaries.length, data: data });
                    }

                });
        }
    };

    /**
     * Mock User.load function
     * @param data
     */
    models.Summary.prototype.load = function(data) {
        var that = this, xhr,
            dfd = $.Deferred();
        if (MONGODB_ID_RX.test(data)) {
            var summaries = db.summaries.find({originalId: data});
            if ($.isArray(summaries) && summaries.length) {
                var summary = $.extend(true, {}, summaries[0]); //clone
                app.cache.getMe()
                    .done(function(me) {
                        if ($.isPlainObject(me) && summary.author.userId === me.id) { //the user is the author
                            summary = filter(summary);
                        } else {
                            if (summary.published instanceof Date) {
                                summary = filter(summary);
                            } else {
                                xhr = new ErrorXHR(401, 'You are not authorised to view drafts');
                                dfd.reject(xhr, ERROR, xhr.statusText);
                            }
                        }
                        that.accept(summary);
                        dfd.resolve(that);
                    });
            } else {
                xhr = new ErrorXHR(404, 'Summary not found');
                dfd.reject(xhr, ERROR, xhr.statusText);
            }
        } else if ($.isPlainObject(data) && MONGODB_ID_RX.test(data.id)) {
            that.accept(data);
            dfd.resolve(that);
        } else {
            xhr = new ErrorXHR(400, 'Unexpected data: please provide a plain object with an id property');
            dfd.reject(xhr, ERROR, xhr.statusText);
        }
        return dfd.promise();
    };

    /**
     * Mock Summary.save function
     */
    models.Summary.prototype.save = function() {
        var that = this, xhr,
            dfd = $.Deferred(),
            summaries = db.summaries.find({originalId: that.id}),
            update = {};
        if ($.isArray(summaries) && summaries.length) {
            var summary = $.extend(true, {}, summaries[0]); //clone
            app.cache.getMe()
                .done(function(me) {
                    if ($.isPlainObject(me) && summary.author.userId === me.id) {
                        for (var field in that.fields) {
                            if (field !== 'id' && that.fields.hasOwnProperty(field) && that.editable(field)) {
                                //TODO: use toJSON?
                                update[field] = that.get(field);
                            }
                        }
                        $.extend(true, summary, update);
                        if (summary.updated instanceof Date) {
                            that.updated = summary.updated = new Date();
                        }
                        db.summaries.update(summary);
                        that.dirty = false;
                        dfd.resolve(that);
                    } else {
                        xhr = new ErrorXHR(401, 'Not authorized to save summary');
                        dfd.reject(xhr, ERROR, xhr.statusText);
                    }
                });
        } else {
            xhr = new ErrorXHR(404, 'Summary not found');
            dfd.reject(xhr, ERROR, xhr.statusText);
        }
        return dfd.promise();
    };

    /**
     * Mock Summary.createDraft function
     */
    models.Summary.prototype.createDraft = function() {
        var that = this,
            dfd = $.Deferred();
        app.cache.getMe()
            .done(function(me) {
                var xhr;
                if ($.isPlainObject(me) && that.author.userId === me.id) {
                    var newDraft, now = new Date(),
                        versions = db.versions.find({summaryId: that.id});
                    if ($.isArray(versions) && versions.length) {
                        versions.sort(function (a, b) {
                            return b.created - a.created;
                        });
                        if (versions[0].state === 0) {
                            xhr = new ErrorXHR(400, 'There is already a draft');
                            dfd.reject(xhr, ERROR, xhr.statusText);
                        } else {
                            newDraft = cloneWithoutDBMetaData(versions[0]);
                            newDraft.id = newId();
                            newDraft.created = now;
                            newDraft.updated = now;
                            newDraft.state = 0;
                            db.versions.insert(newDraft);
                            dfd.resolve(convertFromDBtoResolve(newDraft));
                        }
                    } else {
                        newDraft = {
                            id: newId(),
                            created: now,
                            language: that.language,
                            state: 0,
                            summaryId: that.summaryId,
                            type: that.type,
                            updated: now,
                            userId: that.author.userId
                        };
                        db.versions.insert(newDraft);
                        dfd.resolve(convertFromDBtoResolve(newDraft));
                    }
                } else {
                    xhr = new ErrorXHR(401, 'Not authorized to create draft');
                    dfd.reject(xhr, ERROR, xhr.statusText);
                }
            });
        return dfd.promise();
    };

    /**
     * Mock Summary.publish function
     */
    models.Summary.prototype.publish = function() {
        var that = this,
            dfd = $.Deferred();
        app.cache.getMe()
            .done(function(me) {
                var xhr;
                if ($.isPlainObject(me) && that.author.userId === me.id) {
                    var draftToPublish,
                        versions = db.versions.find({summaryId: that.id});
                    if ($.isArray(versions) && versions.length) {
                        versions.sort(function(a, b) { return b.created - a.created; });
                        if (versions[0].state !== 0) {
                            xhr = new ErrorXHR(400, 'There is no draft to publish');
                            dfd.reject(xhr, ERROR, xhr.statusText);
                        } else {
                            draftToPublish = versions[0];
                            draftToPublish.state = 5;
                            draftToPublish.updated = new Date();
                            db.versions.update(draftToPublish);
                            dfd.resolve(convertFromDBtoResolve(draftToPublish));
                        }
                    } else {
                        xhr = new ErrorXHR(400, 'There is no draft to publish');
                        dfd.reject(xhr, ERROR, xhr.statusText);
                    }
                } else {
                    xhr = new ErrorXHR(401, 'Not authorized to publish draft');
                    dfd.reject(xhr, ERROR, xhr.statusText);
                }
            });
        return dfd.promise();
    };

    /**
     * Mock Summary.rate function
     */
    models.Summary.prototype.rate = function() {
        var dfd = $.Deferred();
        setTimeout(function() {
            dfd.resolve(); //TODO
        }, 0);
        return dfd.promise();
    };

    /**
     * Mock LazyVersionDataSource transport.read function
     * @param options
     * @private
     */
    models.LazyVersionDataSource.fn._transport._read = function(options) {
        var that = this,
            summaries = db.summaries.find({originalId: that.summaryId});
        if ($.isArray(summaries) && summaries.length) {
            var versions = db.versions.find({summaryId: that.summaryId});
            versions.sort(function (a, b) {
                return b.created - a.created;
            });
            app.cache.getMe().done(function (me) {
                if (summaries[0].author.userId !== me.id && versions[0].status === 0) {
                    versions.shift(); //remove draft
                }
                options.success({total: versions.length, data: versions});
            });
        } else {
            var xhr = new ErrorXHR(404, 'Summary not found');
            options.error(xhr, ERROR, xhr.statusText);
        }
    };

    /**
     * Mock Version.load function
     */
    models.Version.prototype.load = function(data) {
        var dfd = $.Deferred();
        setTimeout(function() {
            dfd.resolve(); //TODO
        }, 0);
        return dfd.promise();
    };

    /**
     * Mock Version.save function
     */
    models.Version.prototype.save = function() {
        var dfd = $.Deferred();
        setTimeout(function() {
            dfd.resolve(); //TODO
        }, 0);
        return dfd.promise();
    };

    /**
     * Mock LazyActivityDataSource transport.read function
     * @param options
     * @private
     */
    models.LazyActivityDataSource.fn._transport._read = function(options) {
        var that = this, activities, data = [], i;

        //If we have a summaryId for the content being displayed, we fetch summary activities
        if (MONGODB_ID_RX.test(that.summaryId)) {

            //Note: we get value (rating, score), but not text (comment, report)
            options.data.fields = 'actor,created,type,updated,value,version.versionId';

            activities = db.activities.chain()
                .find({'version.summaryId': that.summaryId})
                .where(function(doc) { return doc.version.language === LOCALE; })
                .data();

            for (i = Math.max(0, (options.data.page - 1) * options.data.pageSize); i < Math.min(activities.length, options.data.page * options.data.pageSize); i++) {
                data.push(filter(activities[i], options.data.fields));
            }
            options.success({total: activities.length, data: data });

            // Without a summaryId, we need an authenticated user to fetch user activities
        } else {

            app.cache.getMe().done(function(me) {

                if ($.isPlainObject(me) && MONGODB_ID_RX.test(me.id)) {

                    log('LazySummaryDataSource read with userId set to authenticated user');

                    //Note: we get value (rating, score), but not text (comment, report)
                    //options.data.fields = 'actor,created,type,updated,value,version';
                    options.data.fields = 'created,type,updated,value,version';

                    activities = db.activities.chain()
                        .find({'actor.userId': me.id})
                        .where(function (doc) {
                            return doc.version.language === LOCALE;
                        })
                        .data();

                    for (i = Math.max(0, (options.data.page - 1) * options.data.pageSize); i < Math.min(activities.length, options.data.page * options.data.pageSize); i++) {
                        data.push(filter(activities[i], options.data.fields));
                    }
                    options.success({total: activities.length, data: data});

                } else {
                    var xhr = new ErrorXHR(401, 'You are not authorized to view these activities');
                    options.error(xhr, ERROR, xhr.statusText);
                }
            });
        }
    };

    /**
     * Mock Activity.load function
     */
    models.Activity.prototype.load = function(data) {
        var dfd = $.Deferred();
        setTimeout(function() {
            dfd.resolve(); //TODO
        }, 0);
        return dfd.promise();
    };

    /**
     * Mock Version.save function
     */
    models.Activity.prototype.save = function() {
        var dfd = $.Deferred();
        setTimeout(function() {
            dfd.resolve(); //TODO
        }, 0);
        return dfd.promise();
    };

    /**
     * Mock CommentDataSource transport.create function
     * @param options
     * @private
     */
    models.CommentDataSource.fn._transport._create = function(options) {
        var that = this, xhr,
            summaries = db.summaries.find({originalId: that.summaryId});
        if ($.isArray(summaries) && summaries.length) {
            var versions = db.versions.find({summaryId: that.summaryId});
            if ($.isArray(versions) && versions.length) {
                versions.sort(function (a, b) {
                    return b - a;
                });
                app.cache.getMe().done(function (me) {
                    if (summaries[0].author.userId !== me.id && versions[0].status === 0) {
                        versions.shift(); //remove draft
                    }
                    if (me.id === null) {
                        xhr = new ErrorXHR(401, 'You need to be authenticated to comment');
                        options.error(xhr, ERROR, xhr.statusText);
                    } else if (versions.length) {
                        var now = new Date(),
                            comment = {
                                id: newId(),
                                created: now,
                                actor: {
                                    userId: me.id,
                                    firstName: me.firstName,
                                    lastName: me.lastName
                                },
                                text: options.data.text,
                                type: 'Comment',
                                updated: now,
                                version: {
                                    language: versions[0].language,
                                    summaryId: versions[0].summaryId,
                                    title: summaries[0].title,
                                    versionId: versions[0].originalId
                                }
                            };
                        db.activities.insert(comment);
                        options.success(convertFromDBtoResolve(comment));
                    } else {
                        xhr = new ErrorXHR(404, 'There is no version to comment');
                        options.error(xhr, ERROR, xhr.statusText);
                    }
                });
            } else {
                xhr = new ErrorXHR(404, 'There is no version to comment');
                options.error(xhr, ERROR, xhr.statusText);
            }
        } else {
            xhr = new ErrorXHR(404, 'Summary not found');
            options.error(xhr, ERROR, xhr.statusText);
        }
    };

    /**
     * Mock CommentDataSource transport.destroy function
     * @param options
     * @private
     */
    models.CommentDataSource.fn._transport._destroy = function(options) {
        var that = this, xhr,
            comments = db.activities.find({originalId: options.data.id});
        if($.isArray(comments) && comments.length) {
            app.cache.getMe().done(function(me){
                if (comments[0].actor.userId === me.id) {
                    db.activities.remove(comments[0]);
                    options.success(convertFromDBtoResolve(comments[0]));
                } else {
                    xhr = new ErrorXHR(401, 'Not authorized to delete comment');
                    options.error(xhr, ERROR, xhr.statusText);
                }
            });
        } else {
            xhr = new ErrorXHR(404, 'Comment not found');
            options.error(xhr, ERROR, xhr.statusText);
        }
    };

    /**
     * Mock CommentDataSource transport.read function
     * @param options
     * @private
     */
    models.CommentDataSource.fn._transport._read = function(options) {
        var that = this, xhr,
            summaries = db.summaries.find({originalId: that.summaryId});
        if ($.isArray(summaries) && summaries.length) {
            var comments = db.activities.chain()
                .find({'version.summaryId': that.summaryId})
                .where(function(doc) { return doc.type === 'Comment'; })
                .data();
            if ($.isArray(comments) && comments.length) {
                var data = [];
                for (var i = Math.max(0, (options.data.page - 1) * options.data.pageSize); i < Math.min(comments.length, options.data.page * options.data.pageSize); i++) {
                    data.push(filter(comments[i], options.data.fields));
                }
                options.success({total: comments.length, data: data });

            } else {
                options.success({total: 0, data: []});
            }
        } else {
            xhr = new ErrorXHR(404, 'Summary not found');
            options.error(xhr, ERROR, xhr.statusText);
        }
    };

    /**
     * Mock CommentDataSource transport.update function
     * @param options
     * @private
     */
    models.CommentDataSource.fn._transport._update = function(options) {
        var that = this, xhr,
            comments = db.activities.find({originalId: options.data.id});
        if($.isArray(comments) && comments.length) {
            app.cache.getMe().done(function(me){
                if (comments[0].actor.userId === me.id) {
                    delete options.data.id;
                    $.extend(true, comments[0], options.data);
                    comments[0].updated = new Date();
                    db.activities.update(comments[0]);
                    options.success(convertFromDBtoResolve(comments[0]));
                } else {
                    xhr = new ErrorXHR(401, 'Not authorized to update comment');
                    options.error(xhr, ERROR, xhr.statusText);
                }
            });
        } else {
            xhr = new ErrorXHR(404, 'Comment not found');
            options.error(xhr, ERROR, xhr.statusText);
        }
    };

    /************************************************************************************
     * Setup in-memory database
     ************************************************************************************/

    /**
     * Filter some fields of a document extracted from LokiJS
     * if fields is undefined, just clean the document from LokiJS metadata
     * @param document
     * @param fields
     */
    function filter(document, fields) {

        function sieve(document, fields) {
            if ($.isArray(fields) && fields.length) {
                for (var prop in document) {
                    if (document.hasOwnProperty(prop)) {
                        if ($.isPlainObject(document[prop])) {
                            var propFields = [];
                            for (var i = 0; i < fields.length; i++) {
                                if (fields[i].indexOf(prop + '.') === 0) {
                                    propFields.push(fields[i].substr(prop.length + 1));
                                }
                            }
                            sieve(document[prop], propFields);
                        } else { //basic types, functions, arrays
                            if (prop !== 'id' && fields.indexOf(prop) === -1) {
                                delete document[prop];
                            }
                        }
                    }
                }
            }
        }

        var doc = {}, farray = [];
        if ($.isPlainObject(document)) {
            if ($.type(fields) === STRING) {
                farray = fields.split(/[\,\s]/);
            } else if ($.isArray(fields)) {
                farray = fields;
            }
            doc = cloneWithoutDBMetaData(document);
            sieve(doc, farray);
        }
        return doc;
    }

    var MockDB = function() {
        this.loki = new window.loki();
        this.activities = this.loki.addCollection('activities');
        this.categories = this.loki.addCollection('categories');
        this.sessions = this.loki.addCollection('sessions');
        this.summaries = this.loki.addCollection('summaries');
        this.tokens = this.loki.addCollection('tokens');
        this.users = this.loki.addCollection('users');
        this.versions = this.loki.addCollection('versions');
    };

    MockDB.prototype.loadCollection = function(name, uri) {
        var dfd = $.Deferred(),
            collection = this[name];
        $.get(uri)
            .done(function(response) {
                //In Mocha, the content type is text
                if ($.type(response) === STRING) {
                    try {
                        response = JSON.parse(response);
                    } catch (exception) {
                        response = [];
                    }
                }
                //With Jetbrains web server the content type is JSON and $.get parses it
                if ($.isArray(response)) {
                    $.each(response, function(index, value) {
                        collection.insert(parse(value));
                    });
                    log(response.length + ' ' + name + ' loaded in memory db');
                }
                dfd.resolve();
            })
            .fail(function(xhr, status, error) {
                dfd.reject(xhr, status, error);
            });
        return dfd.promise();
    };

    MockDB.prototype.load = function() {
        log('loading database...');
        return $.when(
            this.loadCollection('activities', '../data/activities.json'),
            this.loadCollection('categories', '../data/categories.json'),
            this.loadCollection('sessions', '../data/sessions.json'),
            this.loadCollection('summaries', '../data/summaries.json'),
            this.loadCollection('tokens', '../data/tokens.json'),
            this.loadCollection('users', '../data/users.json'),
            this.loadCollection('versions', '../data/versions.json')
        );
    };

    var db = app.mockDB = new MockDB();

}(this, jQuery));
