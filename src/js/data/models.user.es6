

/**
 * User model
 * @type {kidoju.data.Model}
 */
models.User = Model.define({
    id: CONSTANTS.ID, // the identifier of the model, which is required for isNew() to work
    fields: {
        id: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true,
            serializable: false
        },
        born: {
            type: CONSTANTS.DATE,
            nullable: true
        },
        created: {
            type: CONSTANTS.DATE,
            editable: false,
            serializable: false
        },
        description: {
            type: CONSTANTS.STRING
        },
        email: {
            type: CONSTANTS.STRING
        },
        firstName: {
            type: CONSTANTS.STRING
        },
        lastName: {
            type: CONSTANTS.STRING
        },
        // Note: favourites are stored with users but are displayed with rummages
        language: {
            type: CONSTANTS.STRING
        },
        metrics: {
            defaultValue: {},
            editable: false,
            parse(value) {
                return value instanceof models.UserMetricsReference ? value : new models.UserMetricsReference(value);
            },
            serializable: false
        },
        picture: {
            type: CONSTANTS.STRING
        },
        updated: {
            type: CONSTANTS.DATE,
            editable: false,
            serializable: false
        },
        // For complex types, the recommendation is to leave the type undefined and set a default value
        // See: http://www.telerik.com/forums/model---complex-model-with-nested-objects-or-list-of-objects
        // See: http://demos.telerik.com/kendo-ui/grid/editing-custom
        facebook: {
            defaultValue: null,
            editable: false,
            serializable: false,
            parse(value) {
                // return $.isPlainObject(value) ? new models.Account(value) : null;
                return (value instanceof models.Account || value === null) ? value : new models.Account(value);
            }
        },
        google: {
            defaultValue: null,
            editable: false,
            serializable: false,
            parse(value) {
                return (value instanceof models.Account || value === null) ? value : new models.Account(value);
            }
        },
        live: {
            defaultValue: null,
            editable: false,
            serializable: false,
            parse(value) {
                return (value instanceof models.Account || value === null) ? value : new models.Account(value);
            }
        },
        twitter: {
            defaultValue: null,
            editable: false,
            serializable: false,
            parse(value) {
                return (value instanceof models.Account || value === null) ? value : new models.Account(value);
            }
        }
    },

    /* This function's cyclomatic complexity is too high. */
    /* jshint -W074 */

    /**
     * Gets a unique list of email addresses from user accounts
     * @returns {Array}
     */
    emails$: function () {
        var emails = [];
        var facebook = (this.get('facebook.email') || '').trim().toLowerCase();
        var google = (this.get('google.email') || '').trim().toLowerCase();
        var live = (this.get('live.email') || '').trim().toLowerCase();
        var twitter = (this.get('twitter.email') || '').trim().toLowerCase();
        if (facebook.length && emails.indexOf(facebook) === -1) {
            emails.push(facebook);
        }
        if (google.length && emails.indexOf(google) === -1) {
            emails.push(google);
        }
        if (live.length && emails.indexOf(live) === -1) {
            emails.push(live);
        }
        if (twitter.length && emails.indexOf(twitter) === -1) {
            emails.push(twitter);
        }
        return emails;
    },

    /**
     * Gets a unique list of first names from user accounts
     * // TODO: we should not mix firstNames and lastNames from sepearate accounts so this needs to be reviewed
     * @returns {Array}
     */
    firstNames$: function () {
        var firstNames = [];
        var facebook = (this.get('facebook.firstName') || '').trim(); // TODO Capitalize (camel case)
        var google = (this.get('google.firstName') || '').trim();
        var live = (this.get('live.firstName') || '').trim();
        var twitter = (this.get('twitter.firstName') || '').trim();
        if (facebook.length && firstNames.indexOf(facebook) === -1) {
            firstNames.push(facebook);
        }
        if (google.length && firstNames.indexOf(google) === -1) {
            firstNames.push(google);
        }
        if (live.length && firstNames.indexOf(live) === -1) {
            firstNames.push(live);
        }
        if (twitter.length && firstNames.indexOf(twitter) === -1) {
            firstNames.push(twitter);
        }
        return firstNames;
    },

    /**
     * Gets a unique list of last names from user accounts
     * // TODO: we should not mix firstNames and lastNames from sepearate accounts so this needs to be reviewed
     * @returns {Array}
     */
    lastNames$: function () {
        var lastNames = [];
        var facebook = (this.get('facebook.lastName') || '').trim().toUpperCase();
        var google = (this.get('google.lastName') || '').trim().toUpperCase();
        var live = (this.get('live.lastName') || '').trim().toUpperCase();
        var twitter = (this.get('twitter.lastName') || '').trim().toUpperCase();
        if (facebook.length && lastNames.indexOf(facebook) === -1) {
            lastNames.push(facebook);
        }
        if (google.length && lastNames.indexOf(google) === -1) {
            lastNames.push(google);
        }
        if (live.length && lastNames.indexOf(live) === -1) {
            lastNames.push(live);
        }
        if (twitter.length && lastNames.indexOf(twitter) === -1) {
            lastNames.push(twitter);
        }
        return lastNames;
    },

    /* jshint +W074 */

    /**
     * Get user's full name
     * @returns {string}
     */
    fullName$: function () {
        return ((this.get('firstName') || '').trim() + ' ' + (this.get('lastName') || '').trim()).trim();
    },

    /**
     * Get user's avatar
     * @returns {*}
     */
    picture$: function () {
        return this.get('picture') || format(uris.cdn.icons, 'user');
    },

    /**
     * Get user's uri
     * @returns {*}
     */
    userUri$: function () {
        return format(uris.webapp.user, i18n.locale(), this.get('id'));
    },

    /**
     * Get actor medal (based on actor/student) points
     * @returns {*}
     */
    actorMedalUri$: function () {
        var points = this.metrics.actorPoints$();
        var medals = ['grey', 'yellow', 'orange', 'pink', 'red', 'blue', 'green', 'black'];
        var index = Math.min(Math.floor(points / 10), 7);
        return format(uris.cdn.icons, 'medal_' + medals[index]);
    },

    /**
     * Get author medal (based on author/teacher) points
     * @returns {*}
     */
    authorMedalUri$: function () {
        var points = this.metrics.authorPoints$();
        var medals = ['grey', 'yellow', 'orange', 'pink', 'red', 'blue', 'green', 'black'];
        var index = Math.min(Math.floor(points / 10), 7);
        return format(uris.cdn.icons, 'medal2_' + medals[index]);
    },

    /**
     * Load
     * @param data
     * @returns {*}
     */
    load: function (data) {
        var that = this;
        var dfd = $.Deferred();
        // Actually data is never an id in our web application
        if (RX_MONGODB_ID.test(data)) {
            app.cache.getMe()
            .then(function (me) {
                if ($.isPlainObject(me) && data === me.id) {
                    // The authenticated user requests his own profile
                    // Get the full profile including provider accounts
                    rapi.v1.user.getMe()
                    .then(function (user) {
                        that.accept(user);
                        dfd.resolve(user);
                    })
                    .catch(dfd.reject);
                } else {
                    // Any user requests another user's public profile
                    // Get a public profile with limited information
                    rapi.v1.user.getUser(data)
                    .then(function (user) {
                        that.accept(user);
                        dfd.resolve(user);
                    })
                    .catch(dfd.reject);
                }
            })
            .catch(dfd.reject);
        } else if ($.isPlainObject(data) && RX_MONGODB_ID.test(data.id)) {
            app.cache.getMe()
            .then(function (me) {
                if ($.isPlainObject(me) && data.id === me.id) {
                    // The authenticated user requests his own profile
                    // Get the full profile including provider accounts
                    rapi.v1.user.getMe()
                    .then(function (user) {
                        that.accept(user);
                        dfd.resolve(user);
                    })
                    .catch(dfd.reject);
                } else {
                    // Any user requests another user's public profile
                    // Get a public profile with limited information
                    that.accept(data);
                    dfd.resolve(data);
                }
            })
            .catch(dfd.reject);
        } else {
            var xhr = new ErrorXHR(400, 'Neither data nor data.id is a MongoDB ObjectId');
            // dfd.reject(xhr, status, error);
            dfd.reject(xhr, ERROR, xhr.statusText);
        }
        return dfd.promise();
    },

    /**
     * Save
     * @param fields
     * @returns {*}
     */
    save: function (fields) {
        var that = this;
        var dfd = $.Deferred();
        if (that.dirty) {  // TODO Validate
            var data = filter(that.toJSON(), fields);
            // serializable === false in User model field properies (see above) discards the following data
            assert.isNonEmptyPlainObject(data, assert.format(assert.messages.isNonEmptyPlainObject.default, 'data'));
            assert.isUndefined(data.created, assert.format(assert.messages.isUndefined.default, 'data.created'));
            assert.isUndefined(data.facebook, assert.format(assert.messages.isUndefined.default, 'data.facebook'));
            assert.isUndefined(data.google, assert.format(assert.messages.isUndefined.default, 'data.google'));
            assert.isUndefined(data.id, assert.format(assert.messages.isUndefined.default, 'data.id'));
            assert.isUndefined(data.live, assert.format(assert.messages.isUndefined.default, 'data.live'));
            assert.isUndefined(data.twitter, assert.format(assert.messages.isUndefined.default, 'data.twitter'));
            assert.isUndefined(data.updated, assert.format(assert.messages.isUndefined.default, 'data.updated'));
            rapi.v1.user.updateMe(data)
            .then(function (data) {
                // Note: data is not parsed, so dates are string
                that.accept(data); // this updates dirty and updated
                dfd.resolve(data);
            })
            .catch(function (xhr, status, error) {
                dfd.reject(xhr, status, error);
            });
        } else {
            setTimeout(function () {
                dfd.resolve(); // nothing to save, nothing to return
            }, 0);
        }
        return dfd.promise();
    }

});
