/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import __ from './app.i18n.es6';

const HIDDEN = 'input[type="hidden"][name="reference"]';
const EMPTY_OBJECT = JSON.stringify({});

/**
 * getHidden
 * @function getHidden
 */
export function getHidden() {
    return JSON.parse($(HIDDEN).val() || EMPTY_OBJECT);
}

/**
 * getActorReference
 * @function getActorReference
 */
export function getActorReference() {
    const hidden = getHidden();
    return {
        language: __.locale,
        // Assuming hidden is a user
        actorId: hidden.id
    };
}

/**
 * getAuthorReference
 * @function getAuthorReference
 */
export function getAuthorReference() {
    const hidden = getHidden();
    return {
        language: __.locale,
        // Assuming hidden is a user
        authorId: hidden.id
    };
}

/**
 * getLanguageReference
 * @function getLanguageReference
 */
export function getLanguageReference() {
    return {
        language: __.locale
    };
}

/**
 * getSummaryReference
 * @function getSummaryReference
 */
export function getSummaryReference() {
    const hidden = getHidden();
    return {
        language: __.locale,
        summaryId: hidden.summaryId
    };
}

/**
 * getVersionReference
 * @function getVersionReference
 */
export function getVersionReference() {
    const hidden = getHidden();
    return {
        language: __.locale,
        summaryId: hidden.summaryId,
        versionId: hidden.versionId
    };
}
