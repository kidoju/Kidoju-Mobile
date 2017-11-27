/**
 * Copyright (c) 2013-2017 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true */
/* globals define: false */

(function (f, define) {
    'use strict';
    define([
        '../vendor/kendo/cultures/kendo.culture.fr-FR.js',
        '../vendor/kendo/messages/kendo.messages.fr-FR.js',
        '../messages/kendo.mobile.fr.js',
        '../messages/kidoju.messages.fr.js'
    ], f);
})(function () {

    'use strict';

    (function () {
        var app = window.app = window.app || {};
        app.cultures = app.cultures || {};
        app.cultures.fr = {
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
                buttonGroup: {
                    chart: 'Graphique',
                    list: 'Liste'
                },
                listView: {
                    groups: {
                        today: 'Aujourd\'hui',
                        yesterday: 'Hier',
                        startOfWeek: 'Cette semaine',
                        startOfMonth: 'Ce mois'
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
            // Dialogs and alerts
            dialogs: {
                buttons: {
                    cancel: {
                        text: 'Annuler',
                        icon: 'close'
                    },
                    ok: {
                        text: 'OK',
                        icon: 'ok'
                    }
                },
                confirm: 'Confirmation',
                error: 'Erreur',
                info: 'Information',
                success: 'Succès'
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
                viewTitle: 'Recherche'
            },
            // Network connection view
            network: {
                viewTitle: 'Connexion',
                message: 'Pas de réseau'
            },
            // Notification messages
            notifications: {
                activitiesQueryFailure: 'Il y a eu une erreur lors du chargement des activités.',
                batteryCritical: 'Niveau de batterie critique. Rechargez maintenant!',
                batteryLow: 'Niveau de batterie faible. Rechargez bientôt!',
                clickSubmitInfo: 'Pressez <i class="kf kf-submit"></i> pour calculer votre score.',
                confirmSubmit: 'Voulez-vous vraiment soumettre pour obtenir votre score et la correction ?',
                networkOffline: 'Vous n\'êtes pas connecté à Internet.',
                networkOnline: 'Votre connexion Internet est restaurée.',
                oAuthTokenFailure: 'Le service d\'authentification a retourné une erreur.',
                openUrlUnknown: 'Il y a eu une erreur d\'ouverture d\'une url inconnue.',
                openUrlLanguage: 'Veuillez changer de langue pour ouvrir cette url.',
                pageNavigationInfo: 'Pressez <i class="kf kf-previous"></i> et <i class="kf kf-next"></i> pour changer de page.',
                pinSaveFailure: 'Les pins à 4 chiffres ne correspondent pas.',
                pinSaveInfo: 'Veuillez saisir et confirmer votre pin à 4 chiffres avant d\'enregistrer.',
                pinValidationFailure: 'Mauvais pin à 4 chiffres.',
                pinValidationInfo: 'Veuillez saisir votre pin à 4 chiffres pour vous connecter.',
                scanFailure: 'Erreur de scan. Vérifiez que l\'app soit autorisée à utiliser la caméra.',
                scanPrompt: 'Veuillez placer un code dans l\'espace délimité.',
                scanLanguageWarning: 'Veuillez changer de language dans les paramètres pour scanner ce code.',
                scanMatchWarning: 'Ce code ne correspond pas.',
                scoreCalculationFailure: 'Il y a eu une erreur de calcul de votre score.',
                scoreSaveFailure: 'Il y a eu une erreur d\'enregistremenet de votre score.',
                scoreSaveSuccess: 'Votre score a été enregistré avec succès.',
                settingsLoadFailure: 'Il y a eu une erreur lors du chargement des paramètres.',
                sharingFailure: 'Il y a eu une erreur lors du partage du quiz.',
                sharingSuccess: 'Ce quiz a été partagé avec succès.',
                showScoreInfo: 'Pressez <i class="kf kf-score"></i> pour retourner à votre score.',
                signinUrlFailure: 'Il y a eu une erreur d\'obtention d\'url de connexion pour le service d\'authentification.',
                summariesQueryFailure: 'Il y a eu une erreur de recherche dans la base de données.',
                summaryLoadFailure: 'Il y a eu une erreur lors du chargement des données du résumé descriptif.',
                summaryViewInfo: 'Pressez le bouton en bas de page.',
                unknownError: 'Il y a eu une erreur inconnue. Veuillez redémarrer l\'app',
                userLoadFailure: 'Il y a eu une erreur lors du chargement du profil utilisateur.',
                userSaveFailure: 'Il y a eu une erreur d\'enregistremenet de votre profil utilisateur.',
                userSaveSuccess: 'Votre profil utilisateur a été enregistré avec succès.',
                userSignInSuccess: 'Vous êtes connecté en tant que {0}.',
                usersQueryFailure: 'Il y a eu une erreur lors du chargement de la liste des utilisateurs.',
                versionLoadFailure: 'Il y a eu une erreur lors du chargement de la version.',
                versionsLoadFailure: 'Il y a eu une erreur lors du chargement des versions.'
            },
            osNotifications: {
                title: 'Ça fait longtemps...',
                text: 'Pourquoi ne pas lancer {0} pour mesurer vos progrès?'
            },
            // Player view
            player: {
                viewTitle: 'Page {0} de {1}',
                // Labels
                instructions: 'Instructions'
            },
            // Score view
            score: {
                viewTitle: 'Score {0:p0}',
                // Grid
                grid: {
                    columns: {
                        question: 'Question',
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
                category: 'Curriculum',
                language: 'Langue',
                theme: 'Thème',
                user: 'Utilisateur',
                version: 'Version',
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
                go: 'Aller',
                // ActionSheet
                actionSheet: {
                    cancel: 'Annuler',
                    feedback: 'Signaler',
                    play: 'Jouer',
                    share: 'Partager'
                },
                // Social Sharing
                socialSharing: {
                    chooserTitle: 'Sélectionnez une application',
                    message: 'Evaluez vos connaissances sur Kidoju.\n\nTitre:\t\t{0}\nLien:\t\t{1}\nDescription:\t{2}',
                    subject: 'Que connaissez-vous à propos de \u201C{0}\u201D?'
                }
            },
            // Sync view
            sync: {
                viewTitle: 'Synchronisation',
                title: 'Progrès'
                // message: ''
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
                    { value: 'en', text: 'Anglais' },
                    { value: 'fr', text: 'Français' }
                ],
                themes: [
                    { value: 'android-dark', text: 'Android Dark'  },
                    { value: 'android-light', text: 'Android Light' },
                    { value: 'blackberry', text: 'Blackberry' },
                    { value: 'fiori', text: 'Fiori' },
                    { value: 'flat', text: 'Flat' },
                    { value: 'ios', text: 'iOS 6' },
                    { value: 'ios7', text: 'iOS 7+' },
                    { value: 'material-dark', text: 'Material Dark' },
                    { value: 'material-light', text: 'Material Light' },
                    { value: 'meego', text: 'Meego' },
                    { value: 'nova', text: 'Nova' },
                    { value: 'office365', text: 'Office 365' }
                    // { value: 'wp-dark', text: 'Windows Dark' },
                    // { value: 'wp-light', text: 'Windows light' }
                ]
            }
        };
        window.kendo.culture('fr-FR');
    }());

    return window.app;

}, typeof define === 'function' && define.amd ? define : function (_, f) { 'use strict'; f(); });
