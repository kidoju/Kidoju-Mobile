/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

import config from '../app/app.config.jsx';
import i18n from '../app/app.i18n.es6';
import CONSTANTS from '../common/window.constants.es6';
import BaseModel from './data.base.es6';
import extendModelWithTransport from './mixins.transport.es6';
import {
    CountReference,
    RatingCountReference,
    ScoreCountReference
} from './reference.metrics.es6';

const { format } = window.kendo;

/**
 * Account
 * @class Account
 * @extends BaseModel
 */
const Account = BaseModel.define({
    id: CONSTANTS.ID, // the identifier of the model, which is required for isNew() to work
    fields: {
        id: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true,
            serializable: false
        },
        email: {
            type: CONSTANTS.STRING,
            editable: false,
            serializable: false
        },
        firstName: {
            type: CONSTANTS.STRING,
            editable: false,
            serializable: false
        },
        gender: {
            type: CONSTANTS.STRING,
            editable: false,
            serializable: false
        },
        lastName: {
            type: CONSTANTS.STRING,
            editable: false,
            serializable: false
        },
        link: {
            type: CONSTANTS.STRING,
            editable: false,
            serializable: false
        },
        locale: {
            type: CONSTANTS.STRING,
            editable: false,
            serializable: false
        },
        timezone: {
            type: CONSTANTS.STRING,
            editable: false,
            serializable: false
        },
        picture: {
            type: CONSTANTS.STRING,
            editable: false,
            serializable: false
        },
        updated: {
            type: CONSTANTS.DATE,
            editable: false,
            serializable: false
        },
        verified: {
            type: CONSTANTS.BOOLEAN,
            editable: false,
            serializable: false
        }
    }
});

/**
 * UserMetricsReference
 * @class UserMetricsReference
 * @extends BaseModel
 */
const UserMetricsReference = BaseModel.define({
    fields: {
        comments: {
            defaultValue: {},
            editable: false,
            parse(value) {
                return value instanceof CountReference
                    ? value
                    : new CountReference(value);
            },
            serializable: false
        },
        ratings: {
            defaultValue: {},
            editable: false,
            parse(value) {
                return value instanceof RatingCountReference
                    ? value
                    : new RatingCountReference(value);
            },
            serializable: false
        },
        scores: {
            defaultValue: {},
            editable: false,
            parse(value) {
                return value instanceof ScoreCountReference
                    ? value
                    : new ScoreCountReference(value);
            },
            serializable: false
        },
        summaries: {
            defaultValue: {},
            editable: false,
            parse(value) {
                return value instanceof CountReference
                    ? value
                    : new CountReference(value);
            },
            serializable: false
        }
    },

    // We might as well call them student points
    actorPoints$() {
        const ratings =
            (this.get('ratings.count_1') || 0) +
            (this.get('ratings.count_2') || 0) +
            (this.get('ratings.count_3') || 0) +
            (this.get('ratings.count_4') || 0) +
            (this.get('ratings.count_5') || 0);
        const average = this.get('scores.average');
        const count =
            // this.get('scores.count_00') || 0 +
            // (this.get('scores.count_00') || 0) +
            // (this.get('scores.count_05') || 0) +
            // (this.get('scores.count_10') || 0) +
            // (this.get('scores.count_15') || 0) +
            // (this.get('scores.count_20') || 0) +
            (this.get('scores.count_25') || 0) +
            (this.get('scores.count_30') || 0) +
            (this.get('scores.count_35') || 0) +
            (this.get('scores.count_40') || 0) +
            (this.get('scores.count_45') || 0) +
            (this.get('scores.count_50') || 0) +
            (this.get('scores.count_55') || 0) +
            (this.get('scores.count_60') || 0) +
            (this.get('scores.count_65') || 0) +
            (this.get('scores.count_70') || 0) +
            (this.get('scores.count_75') || 0) +
            (this.get('scores.count_80') || 0) +
            (this.get('scores.count_85') || 0) +
            (this.get('scores.count_90') || 0) +
            (this.get('scores.count_95') || 0);
        // Each score above 25 is worth its prorata of 1 point (100/100)
        // And we add some bonus points for rating Kidojus
        return Math.round((count * average) / 100 + 0.1 * ratings);
    },

    // We might as well call them teacher points
    authorPoints$() {
        // Each published Kidoju quiz is worth 10 points
        return this.get('summaries.count') || 0;
    }
});

// TODO transport
const userTransport = new RemoteTransport();

/**
 * User
 * @class User
 * @extends BaseModel
 */
const User = BaseModel.define({
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
                return value instanceof UserMetricsReference
                    ? value
                    : new UserMetricsReference(value);
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
                // return $.isPlainObject(value) ? new Account(value) : null;
                return value instanceof Account || value === null
                    ? value
                    : new Account(value);
            }
        },
        google: {
            defaultValue: null,
            editable: false,
            serializable: false,
            parse(value) {
                return value instanceof Account || value === null
                    ? value
                    : new Account(value);
            }
        },
        live: {
            defaultValue: null,
            editable: false,
            serializable: false,
            parse(value) {
                return value instanceof Account || value === null
                    ? value
                    : new Account(value);
            }
        },
        twitter: {
            defaultValue: null,
            editable: false,
            serializable: false,
            parse(value) {
                return value instanceof Account || value === null
                    ? value
                    : new Account(value);
            }
        }
    },

    /* This function's cyclomatic complexity is too high. */
    /* jshint -W074 */

    /**
     * Gets a unique list of email addresses from user accounts
     * @returns {Array}
     */
    emails$() {
        const emails = [];
        const facebook = (this.get('facebook.email') || '')
            .trim()
            .toLowerCase();
        const google = (this.get('google.email') || '').trim().toLowerCase();
        const live = (this.get('live.email') || '').trim().toLowerCase();
        const twitter = (this.get('twitter.email') || '').trim().toLowerCase();
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
    firstNames$() {
        const firstNames = [];
        const facebook = (this.get('facebook.firstName') || '').trim(); // TODO Capitalize (camel case)
        const google = (this.get('google.firstName') || '').trim();
        const live = (this.get('live.firstName') || '').trim();
        const twitter = (this.get('twitter.firstName') || '').trim();
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
    lastNames$() {
        const lastNames = [];
        const facebook = (this.get('facebook.lastName') || '')
            .trim()
            .toUpperCase();
        const google = (this.get('google.lastName') || '').trim().toUpperCase();
        const live = (this.get('live.lastName') || '').trim().toUpperCase();
        const twitter = (this.get('twitter.lastName') || '')
            .trim()
            .toUpperCase();
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
    fullName$() {
        return `${(this.get('firstName') || '').trim()} ${(
            this.get('lastName') || ''
        ).trim()}`.trim();
    },

    /**
     * Get user's avatar
     * @returns {*}
     */
    picture$() {
        return this.get('picture') || format(config.uris.cdn.icons, 'user');
    },

    /**
     * Get user's uri
     * @returns {*}
     */
    userUri$() {
        return format(config.uris.webapp.user, i18n.locale(), this.get('id'));
    },

    /**
     * Get actor medal (based on actor/student) points
     * @returns {*}
     */
    actorMedalUri$() {
        const points = this.metrics.actorPoints$();
        const medals = [
            'grey',
            'yellow',
            'orange',
            'pink',
            'red',
            'blue',
            'green',
            'black'
        ];
        const index = Math.min(Math.floor(points / 10), 7);
        return format(config.uris.cdn.icons, `medal_${medals[index]}`);
    },

    /**
     * Get author medal (based on author/teacher) points
     * @returns {*}
     */
    authorMedalUri$() {
        const points = this.metrics.authorPoints$();
        const medals = [
            'grey',
            'yellow',
            'orange',
            'pink',
            'red',
            'blue',
            'green',
            'black'
        ];
        const index = Math.min(Math.floor(points / 10), 7);
        return format(config.uris.cdn.icons, `medal2_${medals[index]}`);
    },

    /**
     * Load
     * @param data
     * @returns {*}
     */
    load(data) {
        const that = this;
        const dfd = $.Deferred();
        // Actually data is never an id in our web application
        if (RX_MONGODB_ID.test(data)) {
            app.cache
                .getMe()
                .then(me => {
                    if ($.isPlainObject(me) && data === me.id) {
                        // The authenticated user requests his own profile
                        // Get the full profile including provider accounts
                        rapi.v1.user
                            .getMe()
                            .then(user => {
                                that.accept(user);
                                dfd.resolve(user);
                            })
                            .catch(dfd.reject);
                    } else {
                        // Any user requests another user's public profile
                        // Get a public profile with limited information
                        rapi.v1.user
                            .getUser(data)
                            .then(user => {
                                that.accept(user);
                                dfd.resolve(user);
                            })
                            .catch(dfd.reject);
                    }
                })
                .catch(dfd.reject);
        } else if ($.isPlainObject(data) && RX_MONGODB_ID.test(data.id)) {
            app.cache
                .getMe()
                .then(me => {
                    if ($.isPlainObject(me) && data.id === me.id) {
                        // The authenticated user requests his own profile
                        // Get the full profile including provider accounts
                        rapi.v1.user
                            .getMe()
                            .then(user => {
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
            const xhr = new ErrorXHR(
                400,
                'Neither data nor data.id is a MongoDB ObjectId'
            );
            // dfd.reject(xhr, status, errorThrown);
            dfd.reject(xhr, ERROR, xhr.statusText);
        }
        return dfd.promise();
    },

    /**
     * Save
     * @param fields
     * @returns {*}
     */
    save(fields) {
        const that = this;
        const dfd = $.Deferred();
        if (that.dirty) {
            // TODO Validate
            const data = filter(that.toJSON(), fields);
            // serializable === false in User model field properies (see above) discards the following data
            assert.isNonEmptyPlainObject(
                data,
                assert.format(
                    assert.messages.isNonEmptyPlainObject.default,
                    'data'
                )
            );
            assert.isUndefined(
                data.created,
                assert.format(
                    assert.messages.isUndefined.default,
                    'data.created'
                )
            );
            assert.isUndefined(
                data.facebook,
                assert.format(
                    assert.messages.isUndefined.default,
                    'data.facebook'
                )
            );
            assert.isUndefined(
                data.google,
                assert.format(
                    assert.messages.isUndefined.default,
                    'data.google'
                )
            );
            assert.isUndefined(
                data.id,
                assert.format(assert.messages.isUndefined.default, 'data.id')
            );
            assert.isUndefined(
                data.live,
                assert.format(assert.messages.isUndefined.default, 'data.live')
            );
            assert.isUndefined(
                data.twitter,
                assert.format(
                    assert.messages.isUndefined.default,
                    'data.twitter'
                )
            );
            assert.isUndefined(
                data.updated,
                assert.format(
                    assert.messages.isUndefined.default,
                    'data.updated'
                )
            );
            rapi.v1.user
                .updateMe(data)
                .then(data => {
                    // Note: data is not parsed, so dates are string
                    that.accept(data); // this updates dirty and updated
                    dfd.resolve(data);
                })
                .catch((xhr, status, error) => {
                    dfd.reject(xhr, status, errorThrown);
                });
        } else {
            setTimeout(() => {
                dfd.resolve(); // nothing to save, nothing to return
            }, 0);
        }
        return dfd.promise();
    }
});

/**
 * Extend User with transport
 */
extendModelWithTransport(User, userTransport);

/**
 * Default export
 */
export default User;
