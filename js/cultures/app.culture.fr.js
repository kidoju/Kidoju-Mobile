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
            notification: {
                error: 'Erreur',
                info: 'Information',
                ok: 'OK',
                success: 'Succès',
                warning: 'Attention'
            },
            secureStorage: {
                success: 'Avec le vérouillage écran activé, vous bénéficiez de l\'encryption des données confidentielles.',
                warning: 'Le vérouillage écran est désactivé. Désolé, mais notre application ne peut pas stocker les données confidentielles sans.'
            },
            versions: {
                draft: {
                    name: 'Brouillon'
                },
                published: {
                    name: 'Version {0}'
                }
            },
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
                activities: 'Activités',
                categories: 'Explorer',
                favourites: 'Favoris',
                scan: 'QR Code',
                settings: 'Réglages'
            },
            // Favourites view
            favourites: {
                viewTitle: 'Favoris'
            },
            // Finder view
            finder: {
                viewTitle: 'Recherche',
                actionSheet: {
                    cancel: 'Annuler',
                    play: 'Jouer',
                    share: 'Partager'
                }
            },
            // Player view
            player: {
                explanations: 'Explications',
                instructions: 'Instructions',
                viewTitle: 'Page {0} de {1}'
            },
            // Progress view
            progress: {},
            // Score view
            score: {},
            // Settings view
            settings: {
                viewTitle: 'Réglages',
                user: 'Utilisateur',
                version: 'Version',
                language: 'Langue',
                theme: 'Thème'
            },
            // Sign-in view
            signin: {
                viewTitle: 'Identification',
                groupTitle: 'Veuillez choisir un service d\'authentification.'
            },
            // User view
            user: {
                viewTitle: 'Utilisateur'
            },
            // viewModel
            viewModel: {
                languages: [
                    { value: 'en', text: 'English' },
                    { value: 'fr', text: 'French' }
                ],
                themes: [
                    // We need andark and anlight because webpack does not cope with dash or dot
                    // TODO: check regular expressions in webpack.config.js
                    { text: 'Android Dark', name: 'andark', skin: 'android-dark' },
                    { text: 'Android Light', name: 'anlight', skin: 'android-light' },
                    { text: 'Blackberry', name: 'blackberry', skin: 'blackberry' },
                    { text: 'Fiori', name: 'fiori', skin: 'fiori' },
                    { text: 'Flat', name: 'flat', skin: 'flat' },
                    { text: 'iOS 6', name: 'ios', skin: 'ios' },
                    { text: 'iOS 7+', name: 'ios7', skin: 'ios7' },
                    { text: 'Material', name: 'material', skin: 'material' },
                    { text: 'Nova', name: 'nova', skin: 'nova' },
                    { text: 'Office 365', name: 'office365', skin: 'office365' },
                    { text: 'Windows Phone', name: 'wp', skin: 'wp' }
                ]
            }
        };
        window.kendo.culture('fr-FR');
    }());

    return window.app;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });
