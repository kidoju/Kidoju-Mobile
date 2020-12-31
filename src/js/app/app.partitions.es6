/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import '../common/jquery.deparam.es6';
import CONSTANTS from '../common/window.constants.es6';
import { isMobileApp } from '../data/data.util.es6';
import __ from './app.i18n.es6';

const HIDDEN = 'input[type="hidden"][name="reference"]';
const EMPTY_OBJECT = JSON.stringify({});

/**
 * getHiddenParams
 * @function getHiddenParams
 * @returns {any}
 */
function getHiddenParams() {
    return JSON.parse($(HIDDEN).val() || EMPTY_OBJECT);
}

/**
 * getHashParams
 * @function getHashParams
 * @returns {*}
 */
function getHashParams() {
    return $.deparam(
        window.location.hash.substr(window.location.hash.indexOf('?') + 1)
    );
}

/**
 * getParams
 * @function getParams
 * @returns {*}
 */
function getParams() {
    return isMobileApp() ? getHashParams() : getHiddenParams();
}

/**
 * getActorReference
 * @function getActorReference
 * @returns {{actorId, language}}
 */
function getActorReference() {
    const params = getParams();
    return $.extend(
        true,
        {
            language: __.locale,
        },
        // params.id is an optional userId/actorId
        {
            actorId: params.id, // || CONSTANTS.ZERO_ID,
        }
    );
}

/**
 * getAuthorReference
 * @function getAuthorReference
 */
function getAuthorReference() {
    const params = getParams();
    return $.extend(
        true,
        {
            language: __.locale,
        },
        // params.id is an optional userId/authorId
        {
            authorId: params.id, // || CONSTANTS.ZERO_ID,
        }
    );
}

/**
 * getLanguageReference
 * @function getLanguageReference
 */
function getLanguageReference() {
    return {
        language: __.locale,
    };
}

/**
 * getSummaryReference
 * @function getSummaryReference
 */
function getSummaryReference() {
    const params = getParams();
    return {
        language: __.locale,
        // summaryId is not optional, so use ZERO_ID when we need to find none
        summaryId: params.summaryId || CONSTANTS.ZERO_ID,
    };
}

/**
 * getVersionReference
 * @function getVersionReference
 */
function getVersionReference() {
    const params = getParams();
    return {
        language: __.locale,
        // summaryId and versionId are not optional, so use ZERO_ID when we need to find none
        summaryId: params.summaryId || CONSTANTS.ZERO_ID,
        versionId: params.versionId || CONSTANTS.ZERO_ID,
    };
}

/**
 * Export
 */
export {
    getHiddenParams,
    getHashParams,
    // getParams,
    getActorReference,
    getAuthorReference,
    getLanguageReference,
    getSummaryReference,
    getVersionReference,
};
