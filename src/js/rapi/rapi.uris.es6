/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

const _uris = {
    rapi: {
        ping: '/api/ping',
        oauth: {
            application: '/api/auth/application/{0}',
            refresh: '/api/auth/refresh',
            revoke: '/api/auth/revoke',
            signIn: '/api/auth/{0}/signin',
            signOut: '/api/auth/signout'
        },
        v1: {
            activities: '/api/v1/{0}/summaries/{1}/activities',
            activity: '/api/v1/{0}/summaries/{1}/activities/{2}',
            categories: '/api/v1/languages/{0}/categories',
            files: '/api/v1/{0}/summaries/{1}/files',
            file: '/api/v1/{0}/summaries/{1}/file/{2}',
            languages: '/api/v1/languages',
            language: '/api/v1/languages/{0}',
            me: '/api/v1/users/me',
            myActivities: '/api/v1/users/me/{0}/activities',
            myFavourites: '/api/v1/users/me/{0}/favourites',
            myFavourite: '/api/v1/users/me/{0}/favourites/{1}',
            mySummaries: '/api/v1/users/me/{0}/summaries',
            organizations: '/api/v1/organizations',
            organization: '/api/v1/organizations/{0}',
            summaries: '/api/v1/{0}/summaries',
            summary: '/api/v1/{0}/summaries/{1}',
            upload: '/api/v1/{0}/summaries/{1}/upload',
            user: '/api/v1/users/{0}',
            versions: '/api/v1/{0}/summaries/{1}/versions',
            version: '/api/v1/{0}/summaries/{1}/versions/{2}'
        },
        web: {
            search: '/api/web/search/{0}'
        }
    }
};

/**
 * Get the root of rapi endpoints
 * @returns {{rapi: *}}
 */
export function root() {
    return (window.app || {}).DEBUG
        ? 'http://localhost:3001'
        : `${window.location.protocol}//${window.location.host}`;
}

/**
 * Get all rapi endpoints
 * @returns {{rapi: *}}
 */
export function uris() {
    return _uris;
}
