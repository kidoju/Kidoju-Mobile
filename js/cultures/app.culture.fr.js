/**
 * Copyright (c) 2013-2016 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true */
/* globals define: false */

(function (f, define) {
    'use strict';
    define([
        '../vendor/kendo/cultures/kendo.culture.fr-FR.js',
        '../vendor/kendo/messages/kendo.messages.fr-FR.js',
        '../messages/kidoju.messages.fr.js'
    ], f);
})(function () {

    'use strict';

    (function () {
        var app = window.app = window.app || {};
        app.cultures = app.cultures || {};
        app.cultures.fr = {
            // Activities view
            activities: {
                viewTitle: 'Activités'
            },
            // Categories view
            categories: {
                viewTitle: 'Explorer'
            },
            // Drawer
            drawer: {
                categories: 'Explorer',
                favourites: 'Favoris',
                activities: 'Activités',
                settings: 'Configuration'
            },
            // Favourites view
            favourites: {
                viewTitle: 'Favoris'
            },
            // Settings view
            settings: {
                viewTitle: 'Configuration',
                user: 'Utilisateur',
                version: 'Version',
                language: 'Langue',
                theme: 'Thème'
            },
            // Summaries view
            summaries: {
                viewTitle: 'Recherche'
            }
        };
        window.kendo.culture('fr-FR');
    }());

    return window.app;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });
