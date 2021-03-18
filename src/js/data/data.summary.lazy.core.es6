/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies, import/no-unresolved
import $ from 'jquery';
import 'kendo.data';
import {
    editorUri,
    iconUri,
    playerUri,
    summaryUri,
    userUri,
} from '../app/app.uris.es6';
import CONSTANTS from '../common/window.constants.es6';
import BaseModel from './data.base.es6';

const {
    data: { ObservableArray },
    toString,
} = window.kendo;

// Note: Division between data.summary.lazy.core.es6 and data.summary.lazy.es6
// avoids circular references due to the use of LazySummary for triggers in app.db.es6

/**
 * LazySummary
 * @class LazySummary
 * @extends BaseModel
 */
const LazySummary = BaseModel.define({
    id: CONSTANTS.ID, // the identifier of the model, which is required for isNew() to work
    fields: {
        id: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true,
        },
        authorId: {
            type: CONSTANTS.STRING,
            editable: false,
        },
        authorName: {
            type: CONSTANTS.STRING,
            editable: false,
        },
        comments: {
            from: 'metrics.comments.count',
            type: CONSTANTS.NUMBER,
            defaultValue: 0,
            editable: false,
        },
        created: {
            type: CONSTANTS.DATE,
            editable: false,
        },
        language: {
            type: CONSTANTS.STRING,
            editable: false,
        },
        icon: {
            type: CONSTANTS.STRING,
            editable: false,
        },
        offline: {
            // Used in Kidoju-Mobile only
            type: CONSTANTS.BOOLEAN,
            editable: false,
        },
        publicationId: {
            type: CONSTANTS.STRING,
            nullable: true,
            editable: false,
        },
        published: {
            type: CONSTANTS.DATE,
            nullable: true,
            editable: false,
        },
        ratings: {
            from: 'metrics.ratings.average',
            type: CONSTANTS.NUMBER,
            nullable: true,
            editable: false,
        },
        scores: {
            from: 'metrics.scores.average',
            type: CONSTANTS.NUMBER,
            nullable: true,
            editable: false,
        },
        tags: {
            // type: Array
            defaultValue: [],
            editable: false,
        },
        title: {
            type: CONSTANTS.STRING,
            editable: false,
        },
        type: {
            type: CONSTANTS.STRING,
            editable: false,
        },
        updated: {
            type: CONSTANTS.DATE,
            editable: false,
        },
        userScore: {
            // Used in Kidoju-Mobile only
            type: CONSTANTS.NUMBER,
            nullable: true,
            editable: false,
        },
        views: {
            from: 'metrics.views.count',
            type: CONSTANTS.NUMBER,
            defaultValue: 0,
            editable: false,
        },
    },
    authorUri$() {
        return userUri(this.get('language'), this.get('authorId'));
    },
    created$() {
        // TODO Add timezone
        return this.get('created');
    },
    editorUri$() {
        return editorUri(this.get('language'), this.get('id'));
    },
    hasUserScore$() {
        // Used in Kidoju-Mobile only
        return $.type(this.get('userScore')) === CONSTANTS.NUMBER;
    },
    icon$() {
        return iconUri(this.get('icon'));
    },
    isError$() {
        // Used in Kidoju-Mobile only
        const userScore = this.get('userScore');
        // Note: we need to test the value type because comparing a null to a number is always true
        return $.type(userScore) === CONSTANTS.NUMBER && userScore < 50;
    },
    isSuccess$() {
        // Used in Kidoju-Mobile only
        const userScore = this.get('userScore');
        return $.type(userScore) === CONSTANTS.NUMBER && userScore >= 75;
    },
    isWarning$() {
        // Used in Kidoju-Mobile only
        const userScore = this.get('userScore');
        return (
            $.type(userScore) === CONSTANTS.NUMBER &&
            userScore >= 50 &&
            userScore < 75
        );
    },
    playerUri$() {
        return playerUri(
            this.get('language'),
            this.get('id'),
            this.get('publicationId')
        );
    },
    published$() {
        // TODO Add timezone
        return this.get('published');
    },
    summaryUri$() {
        return summaryUri(this.get('language'), this.get('id'));
    },
    tags$() {
        let ret = [];
        const tags = this.get('tags');
        // In kendo.mobile.ui.ListView, tags are a kendo.data.ObservableArray when the list is built
        // but tags are an array when redrawing the list after scrolling back (up then down)
        // @see https://github.com/kidoju/Kidoju-Mobile/issues/147
        if (Array.isArray(tags) || tags instanceof ObservableArray) {
            ret = tags.map((tag) => ({
                name: tag,
                hash:
                    CONSTANTS.HASHBANG +
                    $.param({
                        filter: { field: 'tags', operator: 'eq', value: tag },
                    }),
            }));
        }
        return ret;
    },
    updated$() {
        // TODO Add timezone
        return this.get('updated');
    },
    userScore$() {
        // Used in Kidoju-Mobile only
        return toString(this.get('userScore') / 100, 'p0');
    },
    /* ,
    createDraft() {
        return rapi.v1.content.executeCommand(
            this.get('language'),
            this.get('id'),
            { command: 'draft' }
        );
    },
    publish() {
        // TODO: check state to avoid a call if not necessary
        return rapi.v1.content.executeCommand(
            this.get('language'),
            this.get('id'),
            { command: 'publish' }
        );
    }
    */
});

/**
 * Default export
 */
export default LazySummary;