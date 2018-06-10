/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true */
/* globals define: false */

(function (f, define) {
    'use strict';
    define([
        '../vendor/kendo/cultures/kendo.culture.fr-FR.js',
        '../vendor/kendo/messages/kendo.messages.fr-FR.js',
        '../messages/mobile.fr.es6',
        '../messages/widgets.fr.es6'
    ], f);
})(function () {

    'use strict';

    (function () {
        var app = window.app = window.app || {};
        app.cultures = app.cultures || {};
        app.cultures.fr = {
            /*
            secureStorage: {
                success: 'Avec le vérouillage écran activé, vous bénéficiez de l’encryption des données confidentielles.',
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
                viewTitle: 'Historique',
                buttonGroup: {
                    chart: 'Graphique',
                    list: 'Liste'
                },
                listView: {
                    groups: {
                        today: 'Aujourd’hui',
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
            appStoreReview: {
                title: 'Votez pour {0}',
                message: 'Si vous aimez {0}, il suffit d’une minute pour encourager nos développements. Merci pour votre soutien !',
                buttons: {
                    cancel: {
                        text: 'Plus tard'
                    },
                    ok: {
                        text: 'Voter maintenant'
                    }
                }
            },
            // Drawer
            drawer: {
                activities: 'Historique',
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
                appVersionFailure: 'Vous utilisez une ancienne version qui pourrait poser des problèmes de compatibilité. Veuillez mettre à jour.',
                batteryCritical: 'Niveau de batterie critique. Rechargez maintenant!',
                batteryLow: 'Niveau de batterie faible. Rechargez bientôt!',
                clickSubmitInfo: 'Pressez <i class="kf kf-submit"></i> pour calculer votre score.',
                confirmSubmit: 'Voulez-vous vraiment soumettre pour obtenir votre score et la correction ?',
                dbMigrationFailure: 'La migration de la base de données mobile a échoué lors de la mise à niveau.',
                networkOffline: 'Vous n’êtes pas connecté à Internet.',
                networkOnline: 'Votre connexion Internet est restaurée.',
                oAuthTokenFailure: 'Le service d’authentification a retourné une erreur.',
                openUrlUnknown: 'Il y a eu une erreur d’ouverture d’une url inconnue.',
                openUrlLanguage: 'Veuillez changer de langue pour ouvrir cette url.',
                pageNavigationInfo: 'Pressez <i class="kf kf-previous"></i> et <i class="kf kf-next"></i> pour changer de page.',
                pinSaveFailure: 'Les pins à 4 chiffres ne correspondent pas.',
                pinSaveInfo: 'Veuillez saisir et confirmer votre pin à 4 chiffres avant d’enregistrer.',
                pinValidationFailure: 'Mauvais pin à 4 chiffres.',
                pinValidationInfo: 'Veuillez saisir votre pin à 4 chiffres pour vous connecter.',
                scanFailure: 'Erreur de scan. Vérifiez que l’app soit autorisée à utiliser la caméra.',
                scanPrompt: 'Veuillez placer un code dans l’espace délimité.',
                scanLanguageWarning: 'Veuillez changer de language dans les paramètres pour scanner ce code.',
                scanMatchWarning: 'Ce code ne correspond pas.',
                scoreCalculationFailure: 'Il y a eu une erreur de calcul de votre score.',
                scoreSaveFailure: 'Il y a eu une erreur d’enregistremenet de votre score.',
                scoreSaveSuccess: 'Votre score a été enregistré avec succès.',
                settingsLoadFailure: 'Il y a eu une erreur lors du chargement des paramètres.',
                sharingFailure: 'Il y a eu une erreur lors du partage du quiz.',
                sharingSuccess: 'Ce quiz a été partagé avec succès.',
                showScoreInfo: 'Pressez <i class="kf kf-score"></i> pour retourner à votre score.',
                signinUrlFailure: 'Il y a eu une erreur d’obtention d’url de connexion pour le service d’authentification.',
                summariesQueryFailure: 'Il y a eu une erreur de recherche dans la base de données.',
                summaryLoadFailure: 'Il y a eu une erreur lors du chargement des données du résumé descriptif.',
                summaryViewInfo: 'Pressez le bouton en bas de page.',
                syncBandwidthLow: 'Vous ne pouvez pas synchroniser vos données avec une faible bande passante.',
                syncBatteryLow: 'Vous ne pouvez pas synchroniser vos données avec des batteries déchargées.',
                syncFailure: 'Il y a eu une erreur de synchronisation des données.',
                syncSuccess: 'les données locales sont synchronisées avec les serveurs distants.',
                syncUnauthorized: 'Vous n’êtes pas autorisé à synchroniser vos données. Veuillez vous identifier avec un service d’authentification.',
                unknownError: 'Il y a eu une erreur inconnue. Veuillez redémarrer l’app.',
                userLoadFailure: 'Il y a eu une erreur lors du chargement du profil utilisateur.',
                userSaveFailure: 'Il y a eu une erreur d’enregistremenet de votre profil utilisateur.',
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
                listView: {
                    groups: 'Page {0}',
                    answer: 'Réponse',
                    solution: 'Solution'
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
                switch: 'Changer d’utilisateur',
                tour: 'Faire un tour',
                // Copyright
                copyright: 'Copyright &copy; 2013-2018 Memba&reg; Sarl'
            },
            // Sign-in view
            signin: {
                viewTitle: 'Tour',
                viewTitle2: 'Identification',
                // Onboarding
                page0: 'Naviguez et recherchez des exercices et des tests de connaissance organisés par matière.',
                page1: 'Jouez les questions, donnez vos réponses et l’application calcule votre score.',
                page2: 'Suivez et mesurez vos progrès.',
                // Notification
                welcome: 'Veuillez sélectionner un service d’identification. Nous ne l’utiliserons jamais pour publier à votre insu.',
                welcome2: '{0}, veuillez sélectionner l’identification par {1} pour renouveler vos autorisations ou pressez <i class="kf kf-user"></i>.'
            },
            // Summary view
            summary: {
                viewTitle: 'Détails',
                // Labels
                author: 'Auteur',
                category: 'Catégorie',
                description: 'Description',
                metrics: '',
                published: 'Publié le',
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
                    // message: 'Evaluez vos connaissances sur Kidoju.\n\nTitre:\t\t{0}\nLien:\t\t{1}\nDescription:\t{2}',
                    message: 'Testez vos connaissances sur Kidoju.\n\n{0}\n{1}',
                    subject: 'Répondez à \u201C{0}\u201D?'
                }
            },
            // Sync view
            sync: {
                viewTitle: 'Synchronisation',
                title: 'Progrès',
                message: {
                    activities: 'Synchonisation des activités',
                    complete: 'Synchronisation terminée'
                },
                pass: {
                    remote: 'Central',
                    local: 'Local'
                },
                buttons: {
                    continue: 'Continuer'
                }
            },
            // User view
            user: {
                viewTitle: 'Utilisateur',
                // Labels
                firstName: 'Prénom',
                lastName: 'Nom',
                lastUse: 'Dern. Util.',
                pin: 'PIN',
                newPIN: 'Nouv. PIN',
                confirm: 'Confirmation',
                // Buttons
                save: 'Enregistrer',
                signIn: 'S’identifier',
                newUser: 'Nouvel Utilisateur',
                changePIN: 'Nouveau PIN'
            },
            // viewModel
            viewModel: {
                languages: [
                    { value: 'en', text: 'Anglais' },
                    { value: 'fr', text: 'Français' }
                ],
                themes: [
                    { value: 'android-dark', text: 'Android Dark' },
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
