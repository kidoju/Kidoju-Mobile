/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.data';
import { BaseModel, BaseDataSource } from './kidoju.data.core.es6';
import CONSTANTS from '../window.constants.es6';
import Page from './kidoju.data.page';

const { kendo } = window;

/**
 * @class Activity
 */
const Activity = BaseModel.define({
    id: CONSTANTS.ID, // the identifier of the model, which is required for isNew() to work
    fields: {
        id: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true
        },
        actor: { // <--- models.UserReference
            // For complex types, the recommendation is to leave the type undefined and set a default value
            // See: http://www.telerik.com/forums/model---complex-model-with-nested-objects-or-list-of-objects
            // See: http://demos.telerik.com/kendo-ui/grid/editing-custom
            defaultValue: null,
            parse(value) {
                return (value instanceof models.UserReference || value === null) ? value : new models.UserReference(value);
            }
        },
        categoryId: {
            type: CONSTANTS.STRING,
            editable: false,
            serializable: false
        },
        created: {
            type: CONSTANTS.DATE,
            editable: false
        },
        type: {
            type: CONSTANTS.STRING,
            editable: false
        },
        updated: {
            type: CONSTANTS.DATE,
            editable: false
        },
        version: { // <--- models.VersionReference
            // For complex types, the recommendation is to leave the type undefined and set a default value
            // See: http://www.telerik.com/forums/model---complex-model-with-nested-objects-or-list-of-objects
            // See: http://demos.telerik.com/kendo-ui/grid/editing-custom
            defaultValue: null,
            parse(value) {
                return (value instanceof models.VersionReference || value === null) ? value : new models.VersionReference(value);
            }
        }
    },
    load: function (summaryId, activityId) {
        var that = this;
        return rapi.v1.content.getSummaryActivity(i18n.locale(), summaryId, activityId)
        .then(function (activity) {
            that.accept(activity);
        });
    },
    save: function () {
        var that = this;
        var language = that.get('version.language') || i18n.locale();
        var summaryId = that.get('version.summaryId');
        var activity = that.toJSON(true); // true means with hierarchy of data sources
        if (that.isNew()) {
            return rapi.v1.content.createSummaryActivity(language, summaryId, activity)
            .then(function (data) {
                // Note: data is not parsed, so dates are string
                that.accept(data); // this updates dirty and updated
            });
        } else {
            var activityId = that.get('id');
            return rapi.v1.content.updateSummaryActivity(language, summaryId, activityId, activity)
            .then(function (data) {
                // Note: data is not parsed, so dates are string
                that.accept(data); // this updates dirty and updated
            });
        }
    }
});

/**
 * Default export
 */
export default Activity;
