/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
// import $ from 'jquery';
import 'kendo.data';
import db from '../app/app.db.es6';
import __ from '../app/app.i18n.es6';
import { iconUri, userUri } from '../app/app.uris.es6';
import assert from '../common/window.assert.es6';
import CONSTANTS from '../common/window.constants.es6';
import AjaxUsers from '../rapi/rapi.users.es6';
import md5 from '../vendor/blueimp/md5';
import BaseModel from './data.base.es6';
import { isMobileApp, normalizeSchema } from './data.util.es6';
import extendModelWithTransport from './mixins.transport.es6';
import CacheItemStrategy from './strategy.cache.item.es6';
import MobileUserStrategy from './strategy.mobileuser.es6';
import LocalTransport from './transports.local.es6';
import LazyRemoteTransport from './transports.remote.lazy.es6';

const {
    data: { DataSource },
    deepExtend,
} = window.kendo;

/**
 * Me model definition
 */
const definition = {
    id: CONSTANTS.ID, // the identifier of the model, which is required for isNew() to work
    fields: {
        id: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true,
        },
        firstName: {
            type: CONSTANTS.STRING,
            editable: false,
        },
        lastName: {
            type: CONSTANTS.STRING,
            editable: false,
        },
        picture: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true,
        },
        provider: {
            // TODO Review
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true,
        },
        // TODO timezone (for display of dates), born (for searches)
        // TODO subscription
        // TODO User Group (sysadmin, ...)
    },
    fullName$() {
        return `${(this.get('firstName') || '').trim()} ${(
            this.get('lastName') || ''
        ).trim()}`.trim();
    },
    picture$() {
        return this.get('picture') || iconUri('user');
    },
    isAuthenticated$() {
        return CONSTANTS.RX_MONGODB_ID.test(this.get('id'));
    },
    userUri$() {
        return userUri(__.locale, this.get('id'));
    },
    onUserPictureError(e) {
        // https://blog.imagekit.io/how-to-handle-loading-images-that-may-not-exist-on-your-website-92e6c3c6ea63
        // on the img tag, bind this error handler as follows: data-bind="events: { error: me.onUserPictureError }"
        e.target.onerror = null;
        e.target.src = iconUri('user');
    },
};

/**
 * Additional data on mobile devices
 */
if (isMobileApp()) {
    deepExtend(definition, {
        fields: {
            // Last time when the mobile device was synchronized with the server for that specific user
            lastSync: {
                type: CONSTANTS.DATE,
                defaultValue() {
                    return new Date(0); // In 1970
                },
            },
            // The current user is the user with the most recent lastUse
            lastUse: {
                type: CONSTANTS.DATE,
                defaultValue() {
                    return new Date();
                },
            },
            md5pin: {
                type: CONSTANTS.STRING,
                nullable: true,
            },
            reviewState: {
                defaultValue: { counter: 0 },
            },
            rootCategoryId: {
                type: CONSTANTS.STRING,
                /*
                defaultValue() {
                    return DEFAULT.ROOT_CATEGORY_ID[i18n.locale()];
                }
                 */
            },
        },
        /**
         * Add a pin
         * @param pin
         */
        addPin(pin) {
            assert.type(
                CONSTANTS.STRING,
                pin,
                assert.format(
                    assert.messages.type.default,
                    'pin',
                    CONSTANTS.STRING
                )
            );
            assert.type(
                CONSTANTS.FUNCTION,
                md5,
                assert.format(
                    assert.messages.type.default,
                    'md5',
                    CONSTANTS.FUNCTION
                )
            );
            const salt = this.get(CONSTANTS.ID);
            assert.match(
                CONSTANTS.RX_MONGODB_ID,
                salt,
                assert.format(
                    assert.messages.match.default,
                    'salt',
                    CONSTANTS.RX_MONGODB_ID
                )
            );
            const md5pin = md5(salt + pin);
            this.set('md5pin', md5pin);
        },
        /**
         * Reset pin
         * @param pin
         */
        resetPin() {
            this.set('md5pin', null);
        },
        /**
         * Verify pin
         * @param pin
         */
        verifyPin(pin) {
            assert.type(
                CONSTANTS.STRING,
                pin,
                assert.format(
                    assert.messages.type.default,
                    'pin',
                    CONSTANTS.STRING
                )
            );
            assert.type(
                CONSTANTS.FUNCTION,
                md5,
                assert.format(
                    assert.messages.type.default,
                    'md5',
                    CONSTANTS.FUNCTION
                )
            );
            const salt = this.get(CONSTANTS.ID);
            assert.match(
                CONSTANTS.RX_MONGODB_ID,
                salt,
                assert.format(
                    assert.messages.match.default,
                    'salt',
                    CONSTANTS.RX_MONGODB_ID
                )
            );
            const md5pin = md5(salt + pin);
            return this.get('md5pin') === md5pin;
        },
    });
}

/**
 * Me (current user)
 * @class Me
 * @extends BaseModel
 */
const Me = BaseModel.define(definition);

/**
 * local transport
 */
const localTransport = new LocalTransport({
    collection: db.users,
    partition: {},
});

/**
 * remote transport
 */
const remoteTransport = new LazyRemoteTransport({
    collection: new AjaxUsers({
        // Fields that do not exist remotely trigger ann error
        // projection: BaseModel.projection(Me),
    }),
});

/**
 * transport
 */
/* eslint-disable prettier/prettier */
const transport = isMobileApp()
    ? new MobileUserStrategy({
        localTransport,
        remoteTransport,
    })
    : new CacheItemStrategy({
        cache: 'session',
        key: CONSTANTS.ME,
        singleton: true,
        transport: remoteTransport,
        // ttl: 24 * 60 * 60
    });
/* eslint-enable prettier/prettier */

/**
 * Extend model with transport
 */
extendModelWithTransport(Me, transport);

/**
 * MeDataSource
 * @class MeDataSource
 * @extends DataSource
 */
const MeDataSource = DataSource.extend({
    init(options = {}) {
        DataSource.fn.init.call(this, {
            pageSize: CONSTANTS.DATA_PAGE_SIZE.MAX,
            ...options,
            ...{
                transport,
                schema: normalizeSchema({
                    modelBase: Me,
                    model: Me,
                }),
                // serverFiltering: true,
                // serverSorting: true,
                // serverPaging: true
            },
        });
    },
});

/**
 * Export
 */
export { Me, MeDataSource };
