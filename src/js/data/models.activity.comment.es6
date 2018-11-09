/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.data';
import { BaseModel, BaseDataSource } from './kidoju.data.core.es6.tmp';
import CONSTANTS from '../window.constants.es6';
import Page from './kidoju.data.page.es6.tmp';

const { kendo } = window;

/**
 * Comment model
 * @type {kidoju.data.Model}
 */
models.Comment = Activity.define({
    fields: {
        text: {
            type: CONSTANTS.STRING
        },
        // the authenticated user
        userId: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true
        }
    },
    init: function (data) {
        // Call the base init method
        Model.fn.init.call(this, data);
        // Enforce the type
        this.type = 'comment';
    },
    actor$: function () {
        return ((this.get('actor.firstName') || '').trim() + ' ' + (this.get('actor.lastName') || '').trim()).trim();
    },
    // TODO: add actorUri$
    isEditable$: function () {
        return this.get('actor.userId') === this.get('userId');
    },
    color$: function () {
        var hex = '000000';
        var name = this.get('actor.lastName');
        for (var i = 0; i < Math.min(3, name.length) ; i++) {
            // 26 alphabet lower case letters spanning char codes 65 to 91,
            // we need to 'space' them to create more color variety
            hex += ((43 * name.charCodeAt(i)) % 256).toString(16);
        }
        return '#' + hex.slice(-6);
    }
});

/**
 * Default export
 */
export default TestActivity;

/**
 * Legacy code
 */
window.kidoju = window.kidoju || {};
window.kidoju.data = window.kidoju.data || {};
window.kidoju.data.TestActivity = TestActivity;
