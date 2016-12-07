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
            dialogs: {
                buttons: {
                    cancel: {
                        text: 'Annuler',
                        icon: 'close'
                    },
                    no: {
                        text: 'Non',
                        icon: 'close'
                    },
                    ok: {
                        text: 'OK',
                        icon: 'ok'
                    },
                    yes: {
                        text: 'Oui',
                        icon: 'ok'
                    }
                },
                error: 'Erreur',
                info: 'Information',
                success: 'Succès',
                warning: 'Attention',
                submitQuestion: {
                    message: 'Voulez-vous vraiment soumettre pour obtenir votre score et la correction ?',
                    title: 'Question'
                }
            },
            /*
            secureStorage: {
                success: 'Avec le vérouillage écran activé, vous bénéficiez de l\'encryption des données confidentielles.',
                warning: 'Le vérouillage écran est désactivé. Désolé, mais notre application ne peut pas stocker les données confidentielles sans.'
            },
            */
            versions: {
                draft: {
                    name: 'Brouillon'
                },
                published: {
                    name: 'Version {0}'
                }
            },
            // Main layout
            layout: {
                back: 'Retour'
            },
            // Activities view
            activities: {
                viewTitle: 'Activités',
                // Grid
                grid: {
                    columns: {
                        date: 'Date',
                        score: 'Score',
                        title: 'Titre'
                    }
                }
            },
            // Categories view
            categories: {
                viewTitle: 'Explorer'
            },
            // Correction view
            correction: {
                viewTitle: 'Page {0} de {1}',
                // Labels
                explanations: 'Explications'
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
            // Notification messages
            notifications: {
                activitiesQueryFailure: 'Il y a eu une erreur lors du chargement des activités.',
                networkOffline: 'Vous n\'êtes pas connecté à Internet.',
                oAuthTokenFailure: 'Le service d\'authentification a retourné une erreur.',
                pinSaveFailure: 'Les pins à 4 chiffres ne correspondent pas.',
                pinSaveInfo: 'Veuillez saisir et confirmer votre pin à 4 chiffres avant d\'enregistrer.',
                pinValidationFailure: 'Mauvais pin à 4 chiffres.',
                pinValidationInfo: 'Veuillez saisir votre pin à 4 chiffres pour vous connecter.',
                scanFailure: 'Erreur de scan.',
                scanPrompt: 'Veuillez placer un code dans l\'espace délimité.',
                scanLanguageWarning: 'Veuillez changer de language dans les paramètres pour scanner ce code.',
                scanMatchWarning: 'Ce code ne correspond pas.',
                scoreCalculationFailure: 'Il y a eu une erreur de calcul de votre score.',
                scoreSaveFailure: 'Il y a eu une erreur d\'enregistremenet de votre score.',
                scoreSaveSuccess: 'Votre score a été enregistré avec succès.',
                settingsLoadFailure: 'Il y a eu une erreur lors du chargement des paramètres.',
                signinUrlFailure: 'Il y a eu une erreur d\'obtention d\'url de connexion pour le service d\'authentification.',
                summariesQueryFailure: 'Il y a eu une erreur de recherche dans la base de données.',
                summaryLoadFailure: 'Il y a eu une erreur lors du chargement des données du résumé descriptif.',
                unknownError: 'Il y a eu une erreur inconnue. Veuillez redémarrer l\'app',
                userLoadFailure: 'Il y a eu une erreur lors du chargement du profil utilisateur.',
                userSaveFailure: 'Il y a eu une erreur d\'enregistremenet de votre profil utilisateur.',
                userSaveSuccess: 'Votre profil utilisateur a été enregistré avec succès.',
                userSignInSuccess: 'Vous êtes connecté en tant que {0}.',
                usersQueryFailure: 'Il y a eu une erreur lors du chargement de la liste des utilisateurs.',
                versionLoadFailure: 'Il y a eu une erreur lors du chargement de la version.',
                versionsLoadFailure: 'Il y a eu une erreur lors du chargement des versions.'
            },
            // Player view
            player: {
                viewTitle: 'Page {0} de {1}',
                // Labels
                instructions: 'Instructions'
            },
            // Sync view
            sync: {
                viewTitle: 'Synchronisation'
            },
            // Score view
            score: {
                viewTitle: 'Score {0:p0}',
                // Grid
                grid: {
                    columns: {
                        description: 'Question',
                        page: 'Page',
                        result: 'Résultat'
                    },
                    noRecords: 'Pas d\'activité'
                }
            },
            // Settings view
            settings: {
                viewTitle: 'Réglages',
                // Labels
                user: 'Utilisateur',
                version: 'Version',
                language: 'Langue',
                theme: 'Thème',
                // Buttons
                switch: 'Changer d\'Utilisateur'
            },
            // Sign-in view
            signin: {
                viewTitle: 'Identification',
                // Notification
                welcome: 'Veuillez sélectionner un service d\'authentification.'
            },
            // Summary view
            summary: {
                viewTitle: 'Détails',
                // Labels
                categories: 'Catégories',
                description: 'Description',
                tags: 'Mots Clés',
                title: 'Titre',
                // Buttons
                go: 'Aller'
            },
            // User view
            user: {
                viewTitle: 'Utilisateur',
                // Labels
                firstName: 'Prénom',
                lastName: 'Nom',
                lastUse: 'Dern. Util.',
                pin: 'PIN',
                confirm: 'Confirmation',
                // Buttons
                save: 'Enregistrer',
                signIn: 'S\'identifier',
                newUser: 'Nouvel Utilisateur'
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
