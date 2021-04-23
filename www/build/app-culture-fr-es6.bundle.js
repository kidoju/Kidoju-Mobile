(self["webpackChunkKidoju_Mobile"] = self["webpackChunkKidoju_Mobile"] || []).push([["app-culture-fr-es6"],{

/***/ "./src/js/cultures/app.culture.fr.es6":
/*!********************************************!*\
  !*** ./src/js/cultures/app.culture.fr.es6 ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mobile_fr_es6__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mobile.fr.es6 */ "./src/js/cultures/mobile.fr.es6");
/* harmony import */ var _webapp_locales_fr_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../webapp/locales/fr.json */ "./webapp/locales/fr.json");
/* harmony import */ var _kendo_fixes_fr_es6__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./kendo.fixes.fr.es6 */ "./src/js/cultures/kendo.fixes.fr.es6");
/* harmony import */ var _vendor_kendo_cultures_kendo_culture_fr_FR__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../vendor/kendo/cultures/kendo.culture.fr-FR */ "./src/js/vendor/kendo/cultures/kendo.culture.fr-FR.js");
/* harmony import */ var _vendor_kendo_cultures_kendo_culture_fr_FR__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_vendor_kendo_cultures_kendo_culture_fr_FR__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _vendor_kendo_messages_kendo_messages_fr_FR__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../vendor/kendo/messages/kendo.messages.fr-FR */ "./src/js/vendor/kendo/messages/kendo.messages.fr-FR.js");
/* harmony import */ var _vendor_kendo_messages_kendo_messages_fr_FR__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_vendor_kendo_messages_kendo_messages_fr_FR__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _widgets_fr_es6__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./widgets.fr.es6 */ "./src/js/cultures/widgets.fr.es6");
/**
 * Copyright (c) 2019-2021 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/**
 * Application resources
 */
// import data from './data.fr.es6';
// import dialogs from './dialogs.fr.es6';
// import editors from './editors.fr.es6';
// import libraries from './libraries.fr.es6';
 // import tools from './tools.fr.es6';



/**
 * Kendo UI resources
 */




/**
 * Requires kendo.core
 */

window.kendo.culture('fr-FR');
/**
 * Default export
 */

/* harmony default export */ __webpack_exports__["default"] = ({
  mobile: _mobile_fr_es6__WEBPACK_IMPORTED_MODULE_0__.default,
  webapp: _webapp_locales_fr_json__WEBPACK_IMPORTED_MODULE_1__
});

/***/ }),

/***/ "./src/js/cultures/kendo.fixes.fr.es6":
/*!********************************************!*\
  !*** ./src/js/cultures/kendo.fixes.fr.es6 ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/**
 * Copyright (c) 2019-2021 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */
// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved

var ui = window.kendo.mobile.ui;
/* ListView messages */

if (ui.ListView) {
  // Beware: this makes all mobile list views filterable by default
  // So non-filterable list views need to have filterable explicitly set to false
  ui.ListView.prototype.options.filterable = jquery__WEBPACK_IMPORTED_MODULE_0___default().extend(true, ui.ListView.prototype.options.filterable, {
    placeholder: 'Rechercher...'
  });
  ui.ListView.prototype.options.messages = jquery__WEBPACK_IMPORTED_MODULE_0___default().extend(true, ui.ListView.prototype.options.messages, {
    loadMoreText: 'Plus de résultats'
  });
}

/***/ }),

/***/ "./src/js/cultures/mobile.fr.es6":
/*!***************************************!*\
  !*** ./src/js/cultures/mobile.fr.es6 ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Copyright (c) 2019-2021 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/**
 * Resources
 */
var res = {
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
      subject: "R\xE9pondez \xE0 \u201C{0}\u201D?"
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
    languages: [{
      value: 'en',
      text: 'Anglais'
    }, {
      value: 'fr',
      text: 'Français'
    }],
    themes: [{
      value: 'android-dark',
      text: 'Android Dark'
    }, {
      value: 'android-light',
      text: 'Android Light'
    }, {
      value: 'blackberry',
      text: 'Blackberry'
    }, {
      value: 'fiori',
      text: 'Fiori'
    }, {
      value: 'flat',
      text: 'Flat'
    }, {
      value: 'ios',
      text: 'iOS 6'
    }, {
      value: 'ios7',
      text: 'iOS 7+'
    }, {
      value: 'material-dark',
      text: 'Material Dark'
    }, {
      value: 'material-light',
      text: 'Material Light'
    }, {
      value: 'meego',
      text: 'Meego'
    }, {
      value: 'nova',
      text: 'Nova'
    }, {
      value: 'office365',
      text: 'Office 365'
    } // { value: 'wp-dark', text: 'Windows Dark' },
    // { value: 'wp-light', text: 'Windows light' }
    ]
  }
};
/**
 * Default export
 */

/* harmony default export */ __webpack_exports__["default"] = (res);

/***/ }),

/***/ "./src/js/cultures/widgets.fr.es6":
/*!****************************************!*\
  !*** ./src/js/cultures/widgets.fr.es6 ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/**
 * Copyright (c) 2019-2021 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */
// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
 // import 'kendo.core';
// No need to import 'kendo.core';

var _ref = window.kendo || {},
    markeditor = _ref.markeditor,
    mathinput = _ref.mathinput,
    ui = _ref.ui;

var AssetManager = ui.AssetManager,
    BaseDialog = ui.BaseDialog,
    CodeEditor = ui.CodeEditor,
    Explorer = ui.Explorer,
    ImageList = ui.ImageList,
    MarkEditor = ui.MarkEditor,
    MediaPlayer = ui.MediaPlayer,
    MultiInput = ui.MultiInput,
    MultiQuiz = ui.MultiQuiz,
    Navigation = ui.Navigation,
    PlayBar = ui.PlayBar,
    PropertyGrid = ui.PropertyGrid,
    Quiz = ui.Quiz,
    Social = ui.Social,
    Stage = ui.Stage,
    StyleEditor = ui.StyleEditor;
/* kidoju.widgets.assetmanager */

if (AssetManager) {
  var options = AssetManager.prototype.options;
  options.messages = jquery__WEBPACK_IMPORTED_MODULE_0___default().extend(true, options.messages, {
    toolbar: {
      upload: 'Mettre en ligne',
      // comme sur Youtube.fr
      delete: 'Supprimer',
      filter: 'Collection: ',
      search: 'Recherche'
    },
    tabs: {
      default: 'Projet'
    },
    data: {
      defaultName: 'Chargement...',
      defaultImage: '' // TODO

    }
  });
}
/* kidoju.widgets.basedialog */


if (BaseDialog) {
  var _options = BaseDialog.prototype.options;
  _options.messages = jquery__WEBPACK_IMPORTED_MODULE_0___default().extend(true, _options.messages, {
    title: {
      error: 'Erreur',
      info: 'Information',
      success: 'Succès',
      warning: 'Avertissement'
    },
    actions: {
      cancel: {
        action: 'cancel',
        imageUrl: 'https://cdn.kidoju.com/images/o_collection/svg/office/close.svg',
        text: 'Annuler'
      },
      close: {
        action: 'close',
        imageUrl: 'https://cdn.kidoju.com/images/o_collection/svg/office/close.svg',
        primary: true,
        text: 'Fermer'
      },
      create: {
        action: 'create',
        imageUrl: 'https://cdn.kidoju.com/images/o_collection/svg/office/plus.svg',
        primary: true,
        text: 'Créer'
      },
      no: {
        action: 'no',
        imageUrl: 'https://cdn.kidoju.com/images/o_collection/svg/office/close.svg',
        text: 'Non'
      },
      ok: {
        action: 'ok',
        imageUrl: 'https://cdn.kidoju.com/images/o_collection/svg/office/ok.svg',
        primary: true,
        text: 'OK'
      },
      yes: {
        action: 'yes',
        imageUrl: 'https://cdn.kidoju.com/images/o_collection/svg/office/ok.svg',
        primary: true,
        text: 'Oui'
      }
    }
  });
}
/* kidoju.widgets.codeeditor */


if (CodeEditor) {
  var _options2 = CodeEditor.prototype.options;
  _options2.messages = jquery__WEBPACK_IMPORTED_MODULE_0___default().extend(true, _options2.messages, {
    formula: 'Formule:',
    notApplicable: 'N/A',
    solution: 'Solution:',
    value: 'Valeur:',
    test: 'Test',
    success: 'Succès',
    failure: 'Échec',
    omit: 'Omission',
    error: 'Erreur',
    ajaxError: 'Erreur de chargement de la librairie de validation.',
    jsonError: 'Erreur d’analyse de la valeur par json. Placez les chaînes de caractères entre guillemets.',
    timeoutError: 'L’exécution du processus de validation a pris trop de temps.'
  });
}
/* kidoju.widgets.explorer */


if (Explorer) {
  var _options3 = Explorer.prototype.options;
  _options3.messages = jquery__WEBPACK_IMPORTED_MODULE_0___default().extend(true, _options3.messages, {
    empty: 'Rien à afficher'
  });
}
/* kidoju.widgets.imagelist */


if (ImageList) {
  var _options4 = ImageList.prototype.options;
  _options4.messages = jquery__WEBPACK_IMPORTED_MODULE_0___default().extend(true, _options4.messages, {
    toolbar: {
      add: 'Ajouter'
    },
    validation: {
      image: 'Une image est requise.',
      text: 'Du texte est requis.'
    }
  });
}
/* kidoju.widgets.markeditor */


if (MarkEditor) {
  var _options5 = MarkEditor.prototype.options;
  _options5.messages = jquery__WEBPACK_IMPORTED_MODULE_0___default().extend(true, _options5.messages, {
    image: 'Une image sans description',
    link: 'Cliquez ici'
  });
}

if (markeditor && markeditor.messages.dialogs) {
  markeditor.messages.dialogs = jquery__WEBPACK_IMPORTED_MODULE_0___default().extend(true, markeditor.messages.dialogs, {
    cancel: '<img alt="icon" src="https://cdn.kidoju.com/images/o_collection/svg/office/close.svg" class="k-image">Annuler',
    okText: '<img alt="icon" src="https://cdn.kidoju.com/images/o_collection/svg/office/ok.svg" class="k-image">OK',
    headingsDialog: {
      title: 'Titres',
      buttons: {
        h1: 'Titre 1',
        h2: 'Heading 2',
        h3: 'Heading 3',
        h4: 'Heading 4',
        h5: 'Heading 5',
        h6: 'Heading 6'
      }
    },
    linkDialog: {
      title: 'Hyperlien',
      labels: {
        text: 'Url'
      }
    },
    imageDialog: {
      title: 'Image',
      labels: {
        url: 'Url'
      }
    },
    latexDialog: {
      title: 'Expression Mathématique',
      labels: {
        display: 'Affichage',
        inline: 'en ligne'
      }
    },
    previewDialog: {
      title: 'Aperçu'
    }
  });
}

if (markeditor && markeditor.messages.toolbar) {
  markeditor.messages.toolbar = jquery__WEBPACK_IMPORTED_MODULE_0___default().extend(true, markeditor.messages.toolbar, {
    undo: 'Annuler',
    redo: 'Rétablir',
    headings: 'Titres',
    headingsButtons: {
      h1: 'Titre 1',
      h2: 'Titre 2',
      h3: 'Titre 3',
      h4: 'Titre 4',
      h5: 'Titre 5',
      h6: 'Titre 6'
    },
    bold: 'Gras',
    italic: 'Italique',
    bulleted: 'Liste à Puces',
    numbered: 'Liste Numérotée',
    blockquote: 'Bloc de Citation',
    hrule: 'Ligne Horizontale',
    link: 'Hyperlien',
    image: 'Image',
    code: 'Code',
    latex: 'Expression Mathématique',
    preview: 'Aperçu dans une Fenêtre'
  });
}
/* kidoju.widgets.mathinput */


if (mathinput && mathinput.messages.dialogs) {
  mathinput.messages.dialogs = jquery__WEBPACK_IMPORTED_MODULE_0___default().extend(true, mathinput.messages.dialogs, {
    keypad: {
      title: 'Clavier',
      buttons: {
        comma: ',',
        stop: '.',
        n0: '0',
        n1: '1',
        n2: '2',
        n3: '3',
        n4: '4',
        n5: '5',
        n6: '6',
        n7: '7',
        n8: '8',
        n9: '9',
        a: 'a',
        b: 'b',
        c: 'c',
        i: 'i',
        j: 'j',
        k: 'k',
        n: 'n',
        p: 'p',
        q: 'q',
        x: 'x',
        y: 'y',
        z: 'z',
        pi: 'Pi',
        infty: 'Infini',
        space: 'Espace',
        subscript: 'Indice'
      }
    },
    basic: {
      title: 'Basique',
      buttons: {
        equal: 'Égal',
        plus: 'Plus',
        minus: 'Moins',
        cdot: 'Fois',
        times: 'Fois',
        div: 'Divisé par',
        pleft: 'Parenthèse gauche (',
        pright: 'Parenthèse droite )',
        frac: 'Fraction',
        sqrt: 'Racine carrée',
        pow2: 'Puissance de 2',
        pow3: 'Puissance de 3',
        sin: 'Sinus',
        cos: 'Cosinus',
        tan: 'Tangente'
      }
    },
    greek: {
      title: 'Grec',
      buttons: {
        alpha: 'Alpha',
        beta: 'Beta',
        gamma: 'Gamma',
        delta: 'Delta',
        epsilon: 'Epsilon',
        // varepsilon
        zeta: 'Zeta',
        eta: 'Eta',
        theta: 'Theta',
        // vartheta
        iota: 'Iota',
        kappa: 'Kappa',
        // varkappa
        lambda: 'Lambda',
        mu: 'Mu',
        nu: 'Nu',
        xi: 'Xi',
        omicron: 'Omicron',
        pi: 'Pi',
        // varpi
        rho: 'Rho',
        // varrho
        sigma: 'Sigma',
        // varsigma
        tau: 'Tau',
        upsilon: 'Upsilon',
        phi: 'Phi',
        // varphi
        chi: 'Chi',
        psi: 'Psi',
        omega: 'Omega'
      }
    },
    operators: {
      title: 'Operateurs',
      buttons: {
        equal: 'Égal',
        plus: 'Plus',
        minus: 'Moins',
        cdot: 'Fois',
        times: 'Tois',
        div: 'Divisé par',
        pleft: 'Parenthèse gauche (',
        pright: 'Parenthèse droite )',
        bleft: 'Crochet gauche [',
        bright: 'Crochet droit ]',
        cleft: 'Accolade gauche {',
        cright: 'Accolade droite }',
        vleft: 'Ligne verticale gauche |',
        vright: 'Ligne verticale droite |',
        lt: 'Inférieur à',
        le: 'Inférieur ou égal à',
        gt: 'Supérieur à',
        ge: 'Supérieur ou égal à',
        neq: 'Non égal (différent)',
        approx: 'Approximativement égal à',
        propto: 'Proportionnel à',
        plusminus: 'Plus-Moins',
        percent: 'Pourcent',
        not: 'Non (négation)',
        and: 'Et',
        or: 'Ou',
        circ: 'Composition',
        nabla: 'Nabla'
      }
    },
    expressions: {
      title: 'Fonctions',
      buttons: {
        sqrt: 'Racine carrée',
        cubert: 'Racine cubique',
        nthroot: 'Racine Nième',
        pow2: 'Puissance de 2',
        pow3: 'Puissance de 3',
        pow: 'Puissance',
        log: 'Logarithme',
        log10: 'Logarithme base 10',
        ln: 'Logarithm Népérien',
        sin: 'Sinis',
        cos: 'Cosinus',
        tan: 'Tangente',
        arcsin: 'Arc sinus',
        arccos: 'Arc cosinus',
        arctan: 'Arc tangente',
        deriv: 'Dérivée',
        partial: 'Dérivée partielle',
        int: 'Intégrale',
        oint: 'Intégrale curviligne sur un contour fermé',
        sum: 'Somme',
        prod: 'Produit',
        lim: 'Limite'
      }
    },
    sets: {
      title: 'Ensembles',
      buttons: {
        cset: 'Complexes',
        pset: 'Premiers',
        nset: 'Naturels',
        qset: 'Rationels',
        rset: 'Réels',
        zset: 'Entiers',
        emptyset: 'Ensemble vide',
        forall: 'Quel que soit',
        exists: 'Il existe',
        nexists: 'Il n’existe pas',
        in: 'Appartient',
        nin: 'N’appartient pas',
        subset: 'Est inclus dans (sous-ensemble)',
        supset: 'Inclut (sur-ensemble)',
        nsubset: 'N’est pas inclus dans',
        nsupset: 'N’inclut pas',
        intersection: 'Intersection',
        union: 'Union',
        to: 'To',
        implies: 'Implique',
        impliedby: 'Implied by',
        nimplies: 'Not implies',
        iff: 'Equivalent to'
      }
    },
    matrices: {
      title: 'Matrices',
      buttons: {
        vector: 'Vecteur',
        widehat: 'Chapeau (angle)',
        matrix: 'Matrice',
        pmatrix: 'Matrice avec parenthèses',
        bmatrix: 'Matrice avec crochets',
        bbmatrix: 'Matrice with accolades',
        vmatrix: 'Matrice avec lignes verticales',
        vvmatrix: 'Matrice à double ligne verticale',
        column: 'Ajouter un colonne',
        row: 'Ajouter une rangée'
      }
    },
    statistics: {
      title: 'Statistiques',
      buttons: {
        factorial: 'Factorielle',
        binomial: 'Combinaison',
        overline: 'Surlignage (moyenne)'
      }
    }
    /*
        units: {
            title: 'Units',
            buttons: {}
        },
        chemistry: {
            title: 'Chemistry',
            buttons: {}
        }
        */

  });
}

if (mathinput && mathinput.messages.toolbar) {
  mathinput.messages.toolbar = jquery__WEBPACK_IMPORTED_MODULE_0___default().extend(true, mathinput.messages.toolbar, {
    field: {
      title: 'Zone de saisie'
    },
    backspace: {
      title: 'Retour arrière'
    },
    keypad: {
      title: 'Clavier',
      buttons: {
        comma: ',',
        stop: '.',
        n0: '0',
        n1: '1',
        n2: '2',
        n3: '3',
        n4: '4',
        n5: '5',
        n6: '6',
        n7: '7',
        n8: '8',
        n9: '9',
        a: 'a',
        b: 'b',
        c: 'c',
        i: 'i',
        j: 'j',
        k: 'k',
        n: 'n',
        p: 'p',
        q: 'q',
        x: 'x',
        y: 'y',
        z: 'z',
        pi: 'Pi',
        infty: 'Infini',
        space: 'Espace',
        subscript: 'Indice'
      }
    },
    basic: {
      title: 'Basique',
      buttons: {
        equal: 'Égal',
        plus: 'Plus',
        minus: 'Moins',
        cdot: 'Fois',
        times: 'Fois',
        div: 'Divisé par',
        pleft: 'Parenthèse gauche (',
        pright: 'Parenthèse droite )',
        frac: 'Fraction',
        sqrt: 'Racine carrée',
        pow2: 'Puissance de 2',
        pow3: 'Puissance de 3',
        sin: 'Sinus',
        cos: 'Cosinus',
        tan: 'Tangente'
      }
    },
    greek: {
      title: 'Grec',
      buttons: {
        alpha: 'Alpha',
        beta: 'Beta',
        gamma: 'Gamma',
        delta: 'Delta',
        epsilon: 'Epsilon',
        // varepsilon
        zeta: 'Zeta',
        eta: 'Eta',
        theta: 'Theta',
        // vartheta
        iota: 'Iota',
        kappa: 'Kappa',
        // varkappa
        lambda: 'Lambda',
        mu: 'Mu',
        nu: 'Nu',
        xi: 'Xi',
        omicron: 'Omicron',
        pi: 'Pi',
        // varpi
        rho: 'Rho',
        // varrho
        sigma: 'Sigma',
        // varsigma
        tau: 'Tau',
        upsilon: 'Upsilon',
        phi: 'Phi',
        // varphi
        chi: 'Chi',
        psi: 'Psi',
        omega: 'Omega'
      }
    },
    operators: {
      title: 'Operateurs',
      buttons: {
        equal: 'Égal',
        plus: 'Plus',
        minus: 'Moins',
        cdot: 'Fois',
        times: 'Tois',
        div: 'Divisé par',
        pleft: 'Parenthèse gauche (',
        pright: 'Parenthèse droite )',
        bleft: 'Crochet gauche [',
        bright: 'Crochet droit ]',
        cleft: 'Accolade gauche {',
        cright: 'Accolade droite }',
        vleft: 'Ligne verticale gauche |',
        vright: 'Ligne verticale droite |',
        lt: 'Inférieur à',
        le: 'Inférieur ou égal à',
        gt: 'Supérieur à',
        ge: 'Supérieur ou égal à',
        neq: 'Non égal (différent)',
        approx: 'Approximativement égal à',
        propto: 'Proportionnel à',
        plusminus: 'Plus-Moins',
        percent: 'Pourcent',
        not: 'Non (négation)',
        and: 'Et',
        or: 'Ou',
        circ: 'Composition',
        nabla: 'Nabla'
      }
    },
    expressions: {
      title: 'Fonctions',
      buttons: {
        sqrt: 'Racine carrée',
        cubert: 'Racine cubique',
        nthroot: 'Racine Nième',
        pow2: 'Puissance de 2',
        pow3: 'Puissance de 3',
        pow: 'Puissance',
        log: 'Logarithme',
        log10: 'Logarithme base 10',
        ln: 'Logarithm Népérien',
        sin: 'Sinis',
        cos: 'Cosinus',
        tan: 'Tangente',
        arcsin: 'Arc sinus',
        arccos: 'Arc cosinus',
        arctan: 'Arc tangente',
        deriv: 'Dérivée',
        partial: 'Dérivée partielle',
        int: 'Intégrale',
        oint: 'Intégrale curviligne sur un contour fermé',
        sum: 'Somme',
        prod: 'Produit',
        lim: 'Limite'
      }
    },
    sets: {
      title: 'Ensembles',
      buttons: {
        cset: 'Complexes',
        pset: 'Premiers',
        nset: 'Naturels',
        qset: 'Rationels',
        rset: 'Réels',
        zset: 'Entiers',
        emptyset: 'Ensemble vide',
        forall: 'Quel que soit',
        exists: 'Il existe',
        nexists: 'Il n’existe pas',
        in: 'Appartient',
        nin: 'N’appartient pas',
        subset: 'Est inclus dans (sous-ensemble)',
        supset: 'Inclut (sur-ensemble)',
        nsubset: 'N’est pas inclus dans',
        nsupset: 'N’inclut pas',
        intersection: 'Intersection',
        union: 'Union',
        to: 'To',
        implies: 'Implique',
        impliedby: 'Implied by',
        nimplies: 'Not implies',
        iff: 'Equivalent to'
      }
    },
    matrices: {
      title: 'Matrices',
      buttons: {
        vector: 'Vecteur',
        widehat: 'Chapeau (angle)',
        matrix: 'Matrice',
        pmatrix: 'Matrice avec parenthèses',
        bmatrix: 'Matrice avec crochets',
        bbmatrix: 'Matrice with accolades',
        vmatrix: 'Matrice avec lignes verticales',
        vvmatrix: 'Matrice à double ligne verticale',
        column: 'Ajouter un colonne',
        row: 'Ajouter une rangée'
      }
    },
    statistics: {
      title: 'Statistiques',
      buttons: {
        factorial: 'Factorielle',
        binomial: 'Combinaison',
        overline: 'Surlignage (moyenne)'
      }
    }
    /*
        units: {
            title: 'Units',
            buttons: {}
        },
        chemistry: {
            title: 'Chemistry',
            buttons: {}
        }
        */

  });
}
/* kidoju.widgets.mediaplayer */


if (MediaPlayer) {
  var _options6 = MediaPlayer.prototype.options;
  _options6.messages = jquery__WEBPACK_IMPORTED_MODULE_0___default().extend(true, _options6.messages, {
    play: 'Jouer/Pauser',
    mute: 'Avec/Sans son',
    full: 'Plein écran',
    notSupported: 'Fichier non supporté'
  });
}
/* kidoju.widgets.multiinput */


if (MultiInput) {
  var _options7 = MultiInput.prototype.options;
  _options7.messages = jquery__WEBPACK_IMPORTED_MODULE_0___default().extend(true, _options7.messages, {
    clear: 'Effacer',
    delete: 'Supprimer'
  });
}
/* kidoju.widgets.multiquiz */


if (MultiQuiz) {
  var _options8 = MultiQuiz.prototype.options;
  _options8.messages = jquery__WEBPACK_IMPORTED_MODULE_0___default().extend(true, _options8.messages, {
    placeholder: 'Sélectionner...'
  });
}
/* kidoju.widgets.navigation */


if (Navigation) {
  var _options9 = Navigation.prototype.options;
  _options9.messages = jquery__WEBPACK_IMPORTED_MODULE_0___default().extend(true, _options9.messages, {
    empty: 'Rien à afficher'
  });
}
/* kidoju.widgets.playbar */


if (PlayBar) {
  var _options10 = PlayBar.prototype.options;
  _options10.messages = jquery__WEBPACK_IMPORTED_MODULE_0___default().extend(true, _options10.messages, {
    empty: 'Rien à afficher',
    page: 'Page',
    of: 'de {0}',
    first: 'Aller à la première page',
    previous: 'Aller à la page précédente',
    next: 'Aller à la prochaine page',
    last: 'Aller à la dernière page',
    refresh: 'Rafraichîr',
    morePages: 'Plus de pages'
  });
}
/* kidoju.widgets.propertygrid */


if (PropertyGrid) {
  var _options11 = PropertyGrid.prototype.options;
  _options11.messages = jquery__WEBPACK_IMPORTED_MODULE_0___default().extend(true, _options11.messages, {
    property: 'Propriété',
    value: 'Valeur'
  });
}
/* kidoju.widgets.quiz */


if (Quiz) {
  var _options12 = Quiz.prototype.options;
  _options12.messages = jquery__WEBPACK_IMPORTED_MODULE_0___default().extend(true, _options12.messages, {
    optionLabel: 'Sélectionner...'
  });
}
/* kidoju.widgets.social */


if (Social) {
  var _options13 = Social.prototype.options;
  _options13.messages = jquery__WEBPACK_IMPORTED_MODULE_0___default().extend(true, _options13.messages, {
    classroom: 'Partager sur Google Classroom',
    facebook: 'Partager sur Facebook',
    google: 'Partager sur Google+',
    linkedin: 'Partager sur LinkedIn',
    pinterest: 'Partager sur Pinterest',
    twitter: 'Partager sur Twitter'
  });
}
/* kidoju.widgets.stage */


if (Stage) {
  var _options14 = Stage.prototype.options;
  _options14.messages = jquery__WEBPACK_IMPORTED_MODULE_0___default().extend(true, _options14.messages, {
    contextMenu: {
      delete: 'Supprimer',
      duplicate: 'Dupliquer'
    },
    noPage: 'Veuillez ajouter ou sélectionner une page'
  });
}
/* kidoju.widgets.styleeditor */


if (StyleEditor) {
  var _options15 = StyleEditor.prototype.options;
  _options15.messages = jquery__WEBPACK_IMPORTED_MODULE_0___default().extend(true, _options15.messages, {
    columns: {
      name: 'Nom',
      value: 'Valeur'
    },
    toolbar: {
      create: 'Nouveau',
      destroy: 'Effacer'
    },
    validation: {
      name: 'Nom de style manquant',
      value: 'Valeur manquante'
    }
  });
}

/***/ }),

/***/ "./src/js/vendor/kendo/cultures/kendo.culture.fr-FR.js":
/*!*************************************************************!*\
  !*** ./src/js/vendor/kendo/cultures/kendo.culture.fr-FR.js ***!
  \*************************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Kendo UI v2020.3.1118 (http://www.telerik.com/kendo-ui)
 * Copyright 2020 Progress Software Corporation and/or one of its subsidiaries or affiliates. All rights reserved.
 *
 * Kendo UI commercial licenses may be obtained at
 * http://www.telerik.com/purchase/license-agreement/kendo-ui-complete
 * If you do not own a commercial license, this file shall be governed by the trial license terms.
















*/

(function(f){
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! kendo.core */ "./src/js/vendor/kendo/kendo.core.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (f),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
}(function(){
(function( window, undefined ) {
    kendo.cultures["fr-FR"] = {
        name: "fr-FR",
        numberFormat: {
            pattern: ["-n"],
            decimals: 2,
            ",": " ",
            ".": ",",
            groupSize: [3],
            percent: {
                pattern: ["-n %","n %"],
                decimals: 2,
                ",": " ",
                ".": ",",
                groupSize: [3],
                symbol: "%"
            },
            currency: {
                name: "Euro",
                abbr: "EUR",
                pattern: ["-n $","n $"],
                decimals: 2,
                ",": " ",
                ".": ",",
                groupSize: [3],
                symbol: "€"
            }
        },
        calendars: {
            standard: {
                days: {
                    names: ["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"],
                    namesAbbr: ["dim.","lun.","mar.","mer.","jeu.","ven.","sam."],
                    namesShort: ["di","lu","ma","me","je","ve","sa"]
                },
                months: {
                    names: ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"],
                    namesAbbr: ["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."]
                },
                AM: [""],
                PM: [""],
                patterns: {
                    d: "dd/MM/yyyy",
                    D: "dddd d MMMM yyyy",
                    F: "dddd d MMMM yyyy HH:mm:ss",
                    g: "dd/MM/yyyy HH:mm",
                    G: "dd/MM/yyyy HH:mm:ss",
                    m: "d MMMM",
                    M: "d MMMM",
                    s: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
                    t: "HH:mm",
                    T: "HH:mm:ss",
                    u: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
                    y: "MMMM yyyy",
                    Y: "MMMM yyyy"
                },
                "/": "/",
                ":": ":",
                firstDay: 1
            }
        }
    }
})(this);
}));

/***/ }),

/***/ "./src/js/vendor/kendo/messages/kendo.messages.fr-FR.js":
/*!**************************************************************!*\
  !*** ./src/js/vendor/kendo/messages/kendo.messages.fr-FR.js ***!
  \**************************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Kendo UI v2020.3.1118 (http://www.telerik.com/kendo-ui)
 * Copyright 2020 Progress Software Corporation and/or one of its subsidiaries or affiliates. All rights reserved.
 *
 * Kendo UI commercial licenses may be obtained at
 * http://www.telerik.com/purchase/license-agreement/kendo-ui-complete
 * If you do not own a commercial license, this file shall be governed by the trial license terms.
















*/

(function(f){
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! kendo.core */ "./src/js/vendor/kendo/kendo.core.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (f),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
}(function(){
(function ($, undefined) {
/* Filter cell operator messages */

if (kendo.ui.FilterCell) {
kendo.ui.FilterCell.prototype.options.operators =
$.extend(true, kendo.ui.FilterCell.prototype.options.operators,{
  "date": {
    "eq": "Est égal à",
    "gte": "Est postérieur ou égal à",
    "gt": "Est postérieur",
    "lte": "Est antérieur ou égal à",
    "lt": "Est antérieur",
    "neq": "N’est pas égal à",
    "isnull": "Est nulle",
    "isnotnull": "N’est pas nulle"
  },
  "number": {
    "eq": "Est égal à",
    "gte": "Est supérieur ou égal à",
    "gt": "Est supérieur à",
    "lte": "Est inférieur ou égal à",
    "lt": "Est inférieur à",
    "neq": "N’est pas égal à",
    "isnull": "Est nulle",
    "isnotnull": "N’est pas nulle"
  },
  "string": {
    "endswith": "Se termine par",
    "eq": "Est égal à",
    "neq": "N’est pas égal à",
    "startswith": "Commence par",
    "contains": "Contient",
    "doesnotcontain": "Ne contient pas",
    "isnull": "Est nulle",
    "isnotnull": "N’est pas nulle",
    "isempty": "Est vide",
    "isnotempty": "N’est pas vide",
    "isnullorempty": "A une valeur",
    "isnotnullorempty": "N'a pas de valeur"
  },
  "enums": {
    "eq": "Est égal à",
    "neq": "N’est pas égal à",
    "isnull": "Est nulle",
    "isnotnull": "N’est pas nulle"
  }
});
}

/* Filter menu operator messages */

if (kendo.ui.FilterMenu) {
kendo.ui.FilterMenu.prototype.options.operators =
$.extend(true, kendo.ui.FilterMenu.prototype.options.operators,{
  "date": {
    "eq": "Est égal à",
    "gte": "Est postérieur ou égal à",
    "gt": "Est postérieur",
    "lte": "Est antérieur ou égal à",
    "lt": "Est antérieur",
    "neq": "N’est pas égal à",
    "isnull": "Est nulle",
    "isnotnull": "N’est pas nulle"
  },
  "number": {
    "eq": "Est égal à",
    "gte": "Est supérieur ou égal à",
    "gt": "Est supérieur à",
    "lte": "Est inférieur ou égal à",
    "lt": "Est inférieur à",
    "neq": "N’est pas égal à",
    "isnull": "Est nulle",
    "isnotnull": "N’est pas nulle"
  },
  "string": {
    "endswith": "Se termine par",
    "eq": "Est égal à",
    "neq": "N’est pas égal à",
    "startswith": "Commence par",
    "contains": "Contient",
    "doesnotcontain": "Ne contient pas",
    "isnull": "Est nulle",
    "isnotnull": "N’est pas nulle",
    "isempty": "Est vide",
    "isnotempty": "N’est pas vide",
    "isnullorempty": "A une valeur",
    "isnotnullorempty": "N'a pas de valeur"
  },
  "enums": {
    "eq": "Est égal à",
    "neq": "N’est pas égal à",
    "isnull": "Est nulle",
    "isnotnull": "N’est pas nulle"
  }
});
}

/* ColumnMenu messages */

if (kendo.ui.ColumnMenu) {
kendo.ui.ColumnMenu.prototype.options.messages =
$.extend(true, kendo.ui.ColumnMenu.prototype.options.messages,{
  "columns": "Colonnes",
  "sortAscending": "Tri croissant",
  "sortDescending": "Tri décroissant",
  "settings": "Paramètres de colonne",
  "done": "Fini",
  "lock": "Bloquer",
  "unlock": "Ouvrir"
});
}

/* RecurrenceEditor messages */

if (kendo.ui.RecurrenceEditor) {
kendo.ui.RecurrenceEditor.prototype.options.messages =
$.extend(true, kendo.ui.RecurrenceEditor.prototype.options.messages,{
  "daily": {
    "interval": "jour(s)",
    "repeatEvery": "Répéter chaque:"
  },
  "end": {
    "after": " Après",
    "occurrence": "occurrence(s)",
    "label": "Finir:",
    "never": "Jamais",
    "on": "Sur",
    "mobileLabel": "Ends"
  },
  "frequencies": {
    "daily": "Une fois par jour",
    "monthly": "Une fois par mois",
    "never": "Jamais",
    "weekly": "Une fois par semaine",
    "yearly": "Une fois par an"
  },
  "monthly": {
    "day": "Jour",
    "interval": "mois",
    "repeatEvery": "Répéter chaque:",
    "repeatOn": "Répéter l'opération sur:"
  },
  "offsetPositions": {
    "first": "premier",
    "fourth": "quatrième",
    "last": "dernier",
    "second": "second",
    "third": "troisième"
  },
  "weekly": {
    "repeatEvery": "Répéter chaque:",
    "repeatOn": "Répéter l'opération sur:",
    "interval": "semaine(s)"
  },
  "yearly": {
    "of": "de",
    "repeatEvery": "Répéter chaque:",
    "repeatOn": "Répéter l'opération sur:",
    "interval": "année(ans)"
  },
  "weekdays": {
    "day": "jour",
    "weekday": "jour de la semaine",
    "weekend": "jour de week-end"
  }
});
}

/* Grid messages */

if (kendo.ui.Grid) {
kendo.ui.Grid.prototype.options.messages =
$.extend(true, kendo.ui.Grid.prototype.options.messages,{
  "commands": {
    "create": "Insérer",
    "destroy": "Effacer",
    "canceledit": "Annuler",
    "update": "Mettre à jour",
    "edit": "Éditer",
    "excel": "Export vers Excel",
    "pdf": "Export en PDF",
    "select": "Sélectionner",
    "cancel": "Annuler les modifications",
    "save": "Enregistrer les modifications"
  },
  "editable": {
    "confirmation": "Êtes-vous sûr de vouloir supprimer cet enregistrement?",
    "cancelDelete": "Annuler",
    "confirmDelete": "Effacer"
  },
  "noRecords": "Aucun enregistrement disponible."
});
}
  /* TreeList messages */

if (kendo.ui.TreeList) {
kendo.ui.TreeList.prototype.options.messages =
$.extend(true, kendo.ui.TreeList.prototype.options.messages,{
  "noRows": "Aucun enregistrement à afficher",
  "loading": "Chargement...",
  "requestFailed": "La requête a échoué.",
  "retry": "Réessayer",
  "commands": {
      "edit": "Modifier",
      "update": "Mettre à jour",
      "canceledit": "Annuler",
      "create": "Créer",
      "createchild": "Créer un élément enfant",
      "destroy": "Supprimer",
      "excel": "Export Excel",
      "pdf": "Export PDF"
  }
});
}

/* Pager messages */

if (kendo.ui.Pager) {
kendo.ui.Pager.prototype.options.messages =
$.extend(true, kendo.ui.Pager.prototype.options.messages,{
  "allPages": "Tous",
  "page": "Page",
  "display": "Afficher les items {0} - {1} de {2}",
  "of": "de {0}",
  "empty": "Aucun enregistrement à afficher.",
  "refresh": "Actualiser",
  "first": "Aller à la première page",
  "itemsPerPage": "articles par page",
  "last": "Aller à la dernière page",
  "next": "Aller à la page suivante",
  "previous": "Aller à la page précédente",
  "morePages": "Plusieurs pages"
});
}

/* TreeListPager messages */

if (kendo.ui.TreeListPager) {
kendo.ui.TreeListPager.prototype.options.messages =
$.extend(true, kendo.ui.TreeListPager.prototype.options.messages,{
  "allPages": "Tous",
  "page": "Page",
  "display": "Afficher les items {0} - {1} de {2}",
  "of": "de {0}",
  "empty": "Aucun enregistrement à afficher.",
  "refresh": "Actualiser",
  "first": "Aller à la première page",
  "itemsPerPage": "articles par page",
  "last": "Aller à la dernière page",
  "next": "Aller à la page suivante",
  "previous": "Aller à la page précédente",
  "morePages": "Plusieurs pages"
});
}

/* FilterCell messages */

if (kendo.ui.FilterCell) {
kendo.ui.FilterCell.prototype.options.messages =
$.extend(true, kendo.ui.FilterCell.prototype.options.messages,{
  "filter": "Filtrer",
  "clear": "Effacer filtre",
  "isFalse": "est fausse",
  "isTrue": "est vrai",
  "operator": "Opérateur"
});
}

/* FilterMenu messages */

if (kendo.ui.FilterMenu) {
kendo.ui.FilterMenu.prototype.options.messages =
$.extend(true, kendo.ui.FilterMenu.prototype.options.messages,{
  "filter": "Filtrer",
  "and": "Et",
  "clear": "Effacer filtre",
  "info": "Afficher les lignes avec la valeur qui",
  "title": "Afficher les lignes avec la valeur qui",
  "selectValue": "-Sélectionner-",
  "isFalse": "est fausse",
  "isTrue": "est vrai",
  "or": "Ou",
  "cancel": "Annuler",
  "operator": "Opérateur",
  "value": "Valeur"
});
}

/* FilterMultiCheck messages */

if (kendo.ui.FilterMultiCheck) {
kendo.ui.FilterMultiCheck.prototype.options.messages =
$.extend(true, kendo.ui.FilterMultiCheck.prototype.options.messages,{
  "checkAll": "Choisir toutes",
  "clear": "Effacer filtre",
  "filter": "Filtrer",
  "search": "Recherche"
});
}

/* Groupable messages */

if (kendo.ui.Groupable) {
kendo.ui.Groupable.prototype.options.messages =
$.extend(true, kendo.ui.Groupable.prototype.options.messages,{
  "empty": "Faites glisser un en-tête de colonne et déposer ici pour grouper par cette colonne."
});
}

/* Editor messages */

if (kendo.ui.Editor) {
kendo.ui.Editor.prototype.options.messages =
$.extend(true, kendo.ui.Editor.prototype.options.messages,{
  "bold": "Gras",
  "createLink": "Insérer un lien hypertexte",
  "fontName": "Police",
  "fontNameInherit": "(police héritée)",
  "fontSize": "Taille de police",
  "fontSizeInherit": "(taille héritée)",
  "formatBlock": "Style du paragraphe",
  "indent": "Augmenter le retrait",
  "insertHtml": "Insérer HTML",
  "insertImage": "Insérer image",
  "insertOrderedList": "Liste numérotée",
  "insertUnorderedList": "Liste à puces",
  "italic": "Italique",
  "justifyCenter": "Centrer",
  "justifyFull": "Justifier",
  "justifyLeft": "Aligner le texte à gauche",
  "justifyRight": "Aligner le texte à droite",
  "outdent": "Diminuer le retrait",
  "strikethrough": "Barré",
  "styles": "Styles",
  "subscript": "Subscript",
  "superscript": "Superscript",
  "underline": "Souligné",
  "unlink": "Supprimer le lien hypertexte",
  "deleteFile": "Êtes-vous sûr de vouloir supprimer \"{0}\"?",
  "directoryNotFound": "Un répertoire avec ce nom n'a pas été trouvé.",
  "emptyFolder": "Vider le dossier",
  "invalidFileType": "Le fichier sélectionné \"{0}\" n'est pas valide. Les types de fichiers supportés sont {1}.",
  "orderBy": "Organiser par:",
  "orderByName": "Nom",
  "orderBySize": "Taille",
  "overwriteFile": "Un fichier avec le nom \"{0}\" existe déjà dans le répertoire courant. Voulez-vous le remplacer?",
  "uploadFile": "Télécharger",
  "backColor": "Couleur de fond",
  "foreColor": "Couleur",
  "dialogButtonSeparator": "Ou",
  "dialogCancel": "Fermer",
  "dialogInsert": "Insérer",
  "imageAltText": "Le texte de remplacement",
  "imageWebAddress": "Adresse Web",
  "imageWidth": "Largeur (px)",
  "imageHeight": "Hauteur (px)",
  "linkOpenInNewWindow": "Ouvrir dans une nouvelle fenêtre",
  "linkText": "Text",
  "linkToolTip": "Info-bulle",
  "linkWebAddress": "Adresse Web",
  "search": "Search",
  "createTable": "Insérer un tableau",
  "addColumnLeft": "Ajouter colonne à gauche",
  "addColumnRight": "Ajouter colonne à droite",
  "addRowAbove": "Ajouter ligne au-dessus",
  "addRowBelow": "Ajouter ligne au-dessous",
  "deleteColumn": "Supprimer la colonne",
  "deleteRow": "Supprimer la ligne",
  "dropFilesHere": "drop files here to upload",
  "formatting": "Format",
  "viewHtml": "View HTML",
  "dialogUpdate": "Update",
  "insertFile": "Insérer un Fichier",
  "dialogOk": "OK",
  "tableWizard": "Assistant de tableau",
  "tableTab": "Table",
  "cellTab": "Cellule",
  "accessibilityTab": "Accessibilité",
  "caption": "Sous-titre",
  "summary": "Sommaire",
  "width": "Largeur",
  "height": "Hauteur",
  "cellSpacing": "Espacement des cellules",
  "cellPadding": "Rembourrage des cellules",
  "cellMargin": "Marge des cellules",
  "alignment": "Alignement",
  "background": "Fond",
  "cssClass": "CSS Classe",
  "id": "Id",
  "border": "Bordure",
  "borderStyle": "Style de bordure",
  "collapseBorders": "Rétracter bordures",
  "wrapText": "Renvoi à la ligne",
  "associateCellsWithHeaders": "Entêtes associées",
  "alignLeft": "Aligner à gauche",
  "alignCenter": "Aligner le centre",
  "alignRight": "Aligner à droite",
  "alignLeftTop": "Aligner à gauche et haut",
  "alignCenterTop": "Aligner le centre et haut",
  "alignRightTop": "Aligner à droite et haut",
  "alignLeftMiddle": "Aligner à gauche et milieu",
  "alignCenterMiddle": "Aligner le centre et milieu",
  "alignRightMiddle": "Aligner à droite et milieu",
  "alignLeftBottom": "Aligner à gauche et bas",
  "alignCenterBottom": "Aligner le centre et bas",
  "alignRightBottom": "Aligner à droite et bas",
  "alignRemove": "Retirer alignement",
  "columns": "Colonnes",
  "rows": "Lignes",
  "selectAllCells": "Sélectionner toutes les cellules"
});
}

/* FileBrowser and ImageBrowser messages */

var browserMessages = {
  "uploadFile" : "Charger",
  "orderBy" : "Trier par",
  "orderByName" : "Nom",
  "orderBySize" : "Taille",
  "directoryNotFound" : "Aucun répértoire de ce nom.",
  "emptyFolder" : "Répertoire vide",
  "deleteFile" : 'Etes-vous sûr de vouloir supprimer "{0}"?',
  "invalidFileType" : "Le fichier sélectionné \"{0}\" n'est pas valide. Les type fichiers supportés sont {1}.",
  "overwriteFile" : "Un fichier du nom \"{0}\" existe déjà dans ce répertoire. Voulez-vous le remplacer?",
  "dropFilesHere" : "glissez les fichiers ici pour les charger",
  "search" : "Recherche"
};

if (kendo.ui.FileBrowser) {
kendo.ui.FileBrowser.prototype.options.messages =
$.extend(true, kendo.ui.FileBrowser.prototype.options.messages, browserMessages);
}

if (kendo.ui.ImageBrowser) {
kendo.ui.ImageBrowser.prototype.options.messages =
$.extend(true, kendo.ui.ImageBrowser.prototype.options.messages, browserMessages);
}


/* Upload messages */

if (kendo.ui.Upload) {
kendo.ui.Upload.prototype.options.localization =
$.extend(true, kendo.ui.Upload.prototype.options.localization,{
  "cancel": "Annuler",
  "dropFilesHere": "déposer les fichiers à télécharger ici",
  "remove": "Retirer",
  "retry": "Réessayer",
  "select": "Sélectionner...",
  "statusFailed": "échoué",
  "statusUploaded": "téléchargé",
  "statusUploading": "téléchargement",
  "uploadSelectedFiles": "Télécharger des fichiers",
  "headerStatusUploaded": "Done",
  "headerStatusUploading": "Uploading..."
});
}

/* Scheduler messages */

if (kendo.ui.Scheduler) {
kendo.ui.Scheduler.prototype.options.messages =
$.extend(true, kendo.ui.Scheduler.prototype.options.messages,{
  "allDay": "toute la journée",
  "cancel": "Annuler",
  "editable": {
    "confirmation": "Etes-vous sûr de vouloir supprimer cet élément?"
  },
  "date": "Date",
  "destroy": "Effacer",
  "editor": {
    "allDayEvent": "Toute la journée",
    "description": "Description",
    "editorTitle": "Evènement",
    "end": "Fin",
    "endTimezone": "End timezone",
    "repeat": "Répéter",
    "separateTimezones": "Use separate start and end time zones",
    "start": "Début",
    "startTimezone": "Start timezone",
    "timezone": " ",
    "timezoneEditorButton": "Fuseau horaire",
    "timezoneEditorTitle": "Fuseaux horaires",
    "title": "Titre",
    "noTimezone": "Pas de fuseau horaire"
  },
  "event": "Evènement",
  "recurrenceMessages": {
    "deleteRecurring": "Voulez-vous supprimer seulement cet évènement ou toute la série?",
    "deleteWindowOccurrence": "Suppression de l'élément courant",
    "deleteWindowSeries": "Suppression de toute la série",
    "deleteWindowTitle": "Suppression d'un élément récurrent",
    "editRecurring": "Voulez-vous modifier seulement cet évènement ou toute la série?",
    "editWindowOccurrence": "Modifier l'occurrence courante",
    "editWindowSeries": "Modifier la série",
    "editWindowTitle": "Modification de l'élément courant"
  },
  "save": "Sauvegarder",
  "time": "Time",
  "today": "Aujourd'hui",
  "views": {
    "agenda": "Agenda",
    "day": "Jour",
    "month": "Mois",
    "week": "Semaine",
    "workWeek": "Semaine de travail",
    "timeline": "Chronologie"
  },
  "deleteWindowTitle": "Suppression de l'élément",
  "showFullDay": "Montrer toute la journée",
  "showWorkDay": "Montrer les heures ouvrables"
});
}


/* Validator messages */

if (kendo.ui.Validator) {
kendo.ui.Validator.prototype.options.messages =
$.extend(true, kendo.ui.Validator.prototype.options.messages,{
  "required": "{0} est requis",
  "pattern": "{0} n'est pas valide",
  "min": "{0} doit être plus grand ou égal à {1}",
  "max": "{0} doit être plus petit ou égal à {1}",
  "step": "{0} n'est pas valide",
  "email": "{0} n'est pas un courriel valide",
  "url": "{0} n'est pas une adresse web valide",
  "date": "{0} n'est pas une date valide",
  "dateCompare": "La date de fin doit être postérieure à la date de début"
});
}

/* Dialog */

if (kendo.ui.Dialog) {
kendo.ui.Dialog.prototype.options.messages =
$.extend(true, kendo.ui.Dialog.prototype.options.localization, {
  "close": "Fermer"
});
}

/* Alert */

if (kendo.ui.Alert) {
kendo.ui.Alert.prototype.options.messages =
$.extend(true, kendo.ui.Alert.prototype.options.localization, {
  "okText": "OK"
});
}

/* Confirm */

if (kendo.ui.Confirm) {
kendo.ui.Confirm.prototype.options.messages =
$.extend(true, kendo.ui.Confirm.prototype.options.localization, {
  "okText": "OK",
  "cancel": "Annuler"
});
}

/* Prompt */
if (kendo.ui.Prompt) {
kendo.ui.Prompt.prototype.options.messages =
$.extend(true, kendo.ui.Prompt.prototype.options.localization, {
  "okText": "OK",
  "cancel": "Annuler"
});
}

/* ListBox messaages */

if (kendo.ui.ListBox) {
kendo.ui.ListBox.prototype.options.messages =
$.extend(true, kendo.ui.ListBox.prototype.options.messages,{
  "tools": {
    "remove": "Supprimer",
    "moveUp": "Déplacer vers le haut",
    "moveDown": "Déplacer vers le bas",
    "transferTo": "Transférer à",
    "transferFrom": "Transférer de",
    "transferAllTo": "Transférer tout à",
    "transferAllFrom": "Transférer tout de"
  }
});
}

 /* FlatColorPicker messages */

 if (kendo.ui.FlatColorPicker) {
  kendo.ui.FlatColorPicker.prototype.options.messages =
  $.extend(true, kendo.ui.FlatColorPicker.prototype.options.messages, {
      "apply": "Appliquer",
      "cancel": "Annuler",
      "noColor": "aucune couleur",
      "clearColor": "Supprimer la couleur"
  });
}

/* ColorPicker messages */

if (kendo.ui.ColorPicker) {
  kendo.ui.ColorPicker.prototype.options.messages =
  $.extend(true, kendo.ui.ColorPicker.prototype.options.messages, {
      "apply": "Appliquer",
      "cancel": "Annuler",
      "noColor": "aucune couleur",
      "clearColor": "Supprimer la couleur"
  });
}

/* Numeric text box messages */

if (kendo.ui.NumericTextBox) {
  kendo.ui.NumericTextBox.prototype.options =
  $.extend(true, kendo.ui.NumericTextBox.prototype.options, {
    "upArrowText": "Augmenter la valeur",
    "downArrowText": "Diminuer la valeur"
  });
}

})(window.kendo.jQuery);
}));

/***/ }),

/***/ "./webapp/locales/fr.json":
/*!********************************!*\
  !*** ./webapp/locales/fr.json ***!
  \********************************/
/***/ (function(module) {

"use strict";
module.exports = JSON.parse("{\"locale\":\"fr\",\"dateFormat\":\"dd MMM yyyy\",\"languages\":[{\"value\":\"en\",\"name\":\"Anglais\",\"icon\":\"\"},{\"value\":\"fr\",\"name\":\"Français\",\"icon\":\"\"}],\"themes\":[{\"value\":\"black\",\"name\":\"Black\",\"colors\":[]},{\"value\":\"bootstrap\",\"name\":\"Bootstrap\",\"colors\":[]},{\"value\":\"flat\",\"name\":\"Flat\",\"colors\":[]},{\"value\":\"highcontrast\",\"name\":\"High Contrast\",\"colors\":[]},{\"value\":\"indigo\",\"name\":\"Indigo\",\"colors\":[]},{\"value\":\"memba\",\"name\":\"Memba\",\"colors\":[]},{\"value\":\"nordic\",\"name\":\"Nordic\",\"colors\":[]},{\"value\":\"turquoise\",\"name\":\"Turquoise\",\"colors\":[]},{\"value\":\"urban\",\"name\":\"Urban\",\"colors\":[]},{\"value\":\"vintage\",\"name\":\"Vintage\",\"colors\":[]}],\"assets\":{\"collections\":{\"summary\":\"Projet\",\"google\":\"Google\"}},\"versions\":{\"draft\":{\"name\":\"Projet\"},\"published\":{\"name\":\"Version {0}\"}},\"meta\":{\"author\":\"Memba Sarl\",\"description\":\"Les enseignants méritent d’excellents outils pour concevoir des évaluations riches et passionnantes. Les étudiants méritent d’avoir accès à une grande bibliothèque d’exercices auto-corrigés sans se soucier des coûts.\",\"keywords\":\"exercice,quiz,activité,connaissance,test,évaluation,niveau,enseigner,apprendre,étudier,visuel,interactif,texte,image,audio,vidéo,choix multiple,question,réponse,math,français,connecteur,glisser,déplacer\",\"title\":\"Kidoju - Créez et Partagez des Quiz Phénoménaux\"},\"header\":{\"navbar\":{\"toggle\":\"Changer la navigation\",\"help\":{\"text\":\"Aide\"},\"support\":{\"text\":\"Support\"},\"finder\":{\"text\":\"Explorer\"},\"create\":{\"text\":\"Créer\"},\"search\":{\"text\":\"Rechercher\",\"placeholder\":\"Recherche...\"},\"signin\":{\"text\":\"S’identifier\"},\"signout\":{\"text\":\"Quitter\"}},\"notifications\":{\"authenticatedUserLoadFailure\":\"Il y a eu une erreur lors du chargement de l’identité de l’utilisateur.\",\"draftCreateFailure\":\"Il y a eu une erreur lors de la création de votre brouillon.\",\"notYetImplemented\":\"Fonctionnalité en développement!\",\"searchSaveFailure\":\"Il y a eu une erreur lors de l’enregistrement de votre favori.\",\"searchSaveSuccess\":\"Votre favori a été enregistré avec succès.\",\"signinFailure\":\"Nous n’avons pas pu vous identifier. Possiblement, vous n’avez pas procédé dans le temps requis.\",\"signinSuccess\":\"Vous avez été identifié avec succès et vous pouvez maintenant créer et retrouver de nouveaux Kidojus.\",\"signinUrlFailure\":\"Il y a eu une erreur d’obtention d’url de connexion pour le service d’authentification.\",\"signoutFailure\":\"Il y a eu une erreur de dèconnexion de l’application.\",\"signoutSuccess\":\"Vous vous êtes déconnecté de l’application avec succès.\",\"summaryCreateFailure\":\"Il y a eu une erreur lors de la création de votre nouveau projet.\"},\"search\":{\"title\":\"Recherche\",\"svg\":\"find_again\",\"text\":{\"label\":\"Titre, description et mots clés\",\"placeholder\":\"Recherche...\"},\"category\":{\"label\":\"Categories\"},\"author\":{\"label\":\"Auteur\",\"placeholder\":\"Les premières lettres du nom\"},\"ageGroup\":{\"label\":\"Age Group:\",\"data\":[{\"text\":\"3-5\",\"value\":1},{\"text\":\"5-7\",\"value\":2},{\"text\":\"7-9\",\"value\":4},{\"text\":\"9-11\",\"value\":8},{\"text\":\"11-14\",\"value\":16},{\"text\":\"14-16\",\"value\":32},{\"text\":\"16-18\",\"value\":64},{\"text\":\"18+\",\"value\":128}]},\"sort\":{\"label\":\"Trier sur:\",\"date\":\"Dates\",\"rate\":\"Etoiles\",\"view\":\"Vues\"},\"saveas\":{\"label\":\"Sauvegarder Sous (nécessite d’être identifié)\"},\"favourite\":{\"placeholder\":\"Votre nom de favori\"},\"validator\":{\"search\":\"Vous ne pouvez pas rechercher sans critère.\",\"favourite\":\"Un nom de favori est nécessaire pour enregistrer.\"},\"buttons\":{\"search\":{\"icon\":\"find_again\",\"text\":\"Rechercher\"},\"cancel\":{\"icon\":\"close\",\"text\":\"Annuler\"}}}},\"footer\":{\"copyright\":\"Version %s - Copyright &copy; 2019-2021 Memba&reg; Sarl.\",\"language\":{\"label\":\"Langue:\"},\"theme\":{\"label\":\"Thème:\"}},\"dialogs\":{\"neworganization\":{\"title\":\"Nouvelle Organization\",\"message\":\"Veuillez saisir un nom, puis cliquer le bouton créer.\",\"administrator\":{\"label\":\"Administrateur\"},\"name\":{\"label\":\"Nom\",\"placeholder\":\"Saisissez un nom\"},\"validator\":{\"name\":\"Le nom n’est pas une chaîne de 2 à 60 caractères de long ou a des caractères invalides.\"},\"buttons\":{\"create\":{\"icon\":\"plus\",\"text\":\"Créer\"},\"cancel\":{\"icon\":\"close\",\"text\":\"Annuler\"}}},\"newsummary\":{\"title\":\"Nouveau Quiz\",\"message\":\"Veuillez saisir une catégorie et un titre, puis cliquer le bouton créer.\",\"title2\":{\"label\":\"Titre\",\"placeholder\":\"Saisissez un titre\"},\"language\":{\"label\":\"Langue\"},\"category\":{\"label\":\"Catégorie\",\"placeholder\":\"Sélectionnez une catégorie\"},\"author\":{\"label\":\"Auteur\"},\"validator\":{\"category\":\"Une catégorie est nécessaire.\",\"title\":\"Le titre n’est pas une chaîne de 2 à 60 caractères de long ou a des caractères invalides.\"},\"buttons\":{\"create\":{\"icon\":\"plus\",\"text\":\"Créer\"},\"cancel\":{\"icon\":\"close\",\"text\":\"Annuler\"}}},\"signin\":{\"message\":\"Veuillez sélectionner un service d’identification. Nous ne l’utiliserons jamais pour publier à votre insu.\",\"terms\":\"J’accepte les&nbsp;<a href=\\\"https://www.kidoju.com/support/en/terms\\\" target=\\\"_blank\\\">conditions d'utilisation</a>.\",\"title\":\"Identification\"},\"signout\":{\"message\":\"Voulez-vous vraiment vous déconnecter?\",\"messageRedirect\":\"Voulez-vous vraiment vous déconnecter et quitter la page?\",\"title\":\"Question\"}},\"editor\":{\"console\":{\"text\":\"Console de Diagnostic\",\"refresh\":\"Rafraîchir\"},\"dialogs\":{\"addPagesFromBulkList\":{\"openDialogFailure\":\"Il y a eu une erreur lors de l’ouverture de la fenêtre.\",\"option\":\"Option {0}\",\"pageCreateFailure\":\"La ligne {0} a été ignorée car elle est ambiguë.\",\"pageCreateSuccess\":\"{0} ligne(s) importée(s) en tant que page(s) et {1} ligne(s) ignorée(s).\",\"question\":\"Question\",\"solution\":\"Solution {0}\",\"title\":\"Import d’une liste\"},\"addPagesFromSearch\":{\"openDialogFailure\":\"Il y a eu une erreur lors de l’ouverture de la fenêtre.\",\"title\":\"Import d’une recherche\"},\"addQuizPage\":{\"openDialogFailure\":\"Il y a eu une erreur lors de l’ouverture de la fenêtre.\",\"title\":\"Choix multiple\"},\"addTextBoxPage\":{\"openDialogFailure\":\"Il y a eu une erreur lors de l’ouverture de la fenêtre.\",\"title\":\"Réponse courte\"},\"markImage\":{\"title\":\"Insérer une image\"},\"publishError\":{\"message\":\"Vous avez {0} erreur(s) à corriger avant de pouvoir publier.\",\"title\":\"Erreur\"},\"publishQuestion\":{\"message\":\"Voulez-vous vraiment publier parce qu’une publication ne peut pas être annulée ?\",\"title\":\"Question\"}},\"notifications\":{\"draftPublishFailure\":\"Il y a eu une erreur lors de la publication du brouillon. Assurez-vous que votre brouillon a au moins un composant par page et que la logique de test est complète.\",\"fileCreateFailure\":\"Il y a eu une erreur lors du chargement du fichier.\",\"fileCreateSuccess\":\"Votre fichier a été chargé avec succès.\",\"fileDeleteFailure\":\"Il y a eu une erreur lors de la suppression du fichier.\",\"fileDeleteSuccess\":\"Le fichier a été supprimé avec succès.\",\"filesLoadFailure\":\"Il y a eu une erreur lors de l’énumération des fichiers.\",\"settingsLoadFailure\":\"Il y a eu une erreur lors du chargement des paramètres.\",\"uploadUrlFailure\":\"Il y a eu une erreur lors du chargement, probablement parce que la taille est inconnue ou dépasse la limite autorisée.\",\"urlImportFailure\":\"Il y a eu une erreur lors de l’import, probablement parce que la taille est inconnue ou dépasse la limite autorisée.\",\"urlImportSuccess\":\"Le fichier a été importé avec succès.\",\"versionLoadFailure\":\"Il y a eu une erreur lors du chargement de votre version.\",\"versionSaveFailure\":\"Il y a eu une erreur lors de l’enregistrement de votre version.\",\"versionSaveSuccess\":\"Votre version a été enregistrée avec succès.\"},\"panelbar\":{\"toolbox\":{\"text\":\"Outils\"},\"explorer\":{\"text\":\"Explorateur\"},\"attributes\":{\"text\":\"Attributs d’affichage\"},\"properties\":{\"text\":\"Logique de test\"},\"instructions\":{\"text\":\"Instructions\"},\"explanations\":{\"text\":\"Explications\"},\"settings\":{\"text\":\"Alignements\",\"snapAngle\":\"Angle\",\"snapGrid\":\"Grille\"}},\"toolbar\":{\"home\":{\"icon\":\"home\"},\"page\":{\"text\":\"Page\",\"icon\":\"plus\",\"copy\":{\"text\":\"Dupliquer\",\"icon\":\"copy\"},\"delete\":{\"text\":\"Supprimer\",\"icon\":\"garbage_can_red\"},\"style\":{\"text\":\"Style\",\"icon\":\"pens\"},\"import\":{\"text\":\"Import d’une recherche\",\"icon\":\"find_again\"},\"bulk\":{\"text\":\"Import d’une liste\",\"icon\":\"list_style_numbered\"},\"quiz\":{\"text\":\"Choix multiple\",\"icon\":\"radio_button_group\"},\"textbox\":{\"text\":\"Réponse courte\",\"icon\":\"text_field\"}},\"play\":{\"text\":\"Jouer\",\"icon\":\"media_play\"},\"publish\":{\"text\":\"Publier\",\"icon\":\"cloud_upload\"},\"save\":{\"text\":\"Enregistrer\",\"icon\":\"floppy_disk\"},\"summary\":{\"text\":\"Détails\",\"icon\":\"document_notebook\",\"assets\":{\"text\":\"Fichiers\",\"icon\":\"document_attachment\"},\"properties\":{\"text\":\"Propriétés\",\"icon\":\"document_size\"}}}},\"error\":{\"icon\":\"error\",\"back\":\"Back\"},\"finder\":{\"list\":{\"author\":{\"publishedOn\":\"Publié le \",\"by\":\" par \"},\"buttons\":{\"play\":{\"icon\":\"media_play\",\"text\":\"Jouer\"},\"summary\":{\"icon\":\"document_notebook\",\"text\":\"Détails\"}}},\"searchHeader\":{\"name\":\"Recherche\",\"icon\":\"find_again\"},\"notifications\":{\"favouriteDestroyFailure\":\"Il y a eu une erreur lors de la suppression d’un favori.\",\"favouriteDestroySuccess\":\"Favori supprimé avec succès.\",\"settingsLoadFailure\":\"Il y a eu une erreur lors du chargement des paramètres.\",\"summariesQueryFailure\":\"Il y a eu une erreur de recherche dans la base de données.\",\"versionsLoadFailure\":\"Il y a eu une erreur lors du chargement des versions.\"},\"toolbar\":{\"categories\":{\"text\":\"Catégories\",\"icon\":\"box_surprise\"}},\"treeview\":{\"delete\":\"Supprimer\",\"rootNodes\":{\"home\":{\"name\":\"Explorer\",\"icon\":\"home\"},\"favourites\":{\"name\":\"Favoris\",\"icon\":\"star\"},\"categories\":{\"name\":\"Catégories\",\"icon\":\"folders2\"}}}},\"home\":{\"icon\":\"home\",\"title\":\"Créez et Partagez des Quiz Phénoménaux\",\"signin\":\"Veuillez vous identifier pour créer un nouveau Quiz\",\"description\":\"Les enseignants méritent d’excellents outils pour concevoir des évaluations riches et passionnantes. Les étudiants méritent d’avoir accès à une grande bibliothèque d’exercices auto-corrigés sans se soucier des coûts.\",\"freeTrial\":\"Partager est Gratuit\",\"watchVideo\":\"Vidéo\",\"gallery\":{\"laptop\":\"Les quiz phénoménaux fonctionnent dans n’importe quel navigateur, notamment Chrome, Firefox, Internet Explorer, Opera et Safari.\",\"mobile\":\"Les quiz phénoménaux fonctionnent sur les appareils mobiles, notamment Android, iPad et iPhone.\"},\"notifications\":{\"settingsLoadFailure\":\"Il y a eu une erreur lors du chargement des paramètres.\"}},\"player\":{\"actor\":{\"created\":{\"label\":\"Membre depuis:\"},\"points\":{\"label\":\"Points:\"}},\"comparison\":{\"text\":\"Comparez votre score avec les autres utilisateurs:\"},\"correction\":{\"columns\":{\"question\":\"Question\",\"page\":\"Page\",\"result\":\"Résultat\",\"score\":\"Score\",\"solution\":\"Solution\",\"value\":\"Réponse\"},\"footer\":{\"score\":\"Total: #: sum #\"},\"pdf\":{\"paging\":\"Page #: pageNum # sur #: totalPages #\",\"title\":\"{0} ({1:dd-MMM-yyyy})\",\"actor\":\"{0} - Score: {1:p0}\"},\"tooltip\":{\"omit\":\"Omission:&nbsp;\",\"failure\":\"Échec:&nbsp;\",\"success\":\"Succès:&nbsp;\",\"score\":\"Votre score:&nbsp;\"}},\"dialogs\":{\"editQuestion\":{\"message\":\"Voulez-vous vraiment créer un nouveau brouillon à éditer?\",\"title\":\"Question\"},\"submitQuestion\":{\"message\":\"Voulez-vous vraiment soumettre pour obtenir votre score et la correction ?\",\"title\":\"Question\"}},\"infopanel\":{\"instructions\":{\"text\":\"Instructions\",\"icon\":\"teacher\"},\"explanations\":{\"text\":\"Explications\",\"icon\":\"teacher\"}},\"notifications\":{\"actorLoadFailure\":\"Il y a eu une erreur lors du chargement du profil utilisateur.\",\"draftCreateFailure\":\"Il y a eu une erreur lors de la création de votre brouillon.\",\"ratingFailure\":\"Il y a eu une erreur de notation de la version en cours. Peut-être a-t-elle déjà été évaluée.\",\"ratingSuccess\":\"La version en cours a été évaluée avec succès.\",\"scoreCacheFailure\":\"Il y a eu une erreur lors du chargement du score de session.\",\"scoreCalculationFailure\":\"Il y a eu une erreur lors du calcul du score.\",\"scoreNotFound\":\"Le score n’a pas pu être trouvé.\",\"scoreReset\":\"Votre score a été réinitialisé.\",\"scoresLoadFailure\":\"Il y a eu une erreur lors du chargement des scores.\",\"scoreSaveFailure\":\"Il y a eu une erreur lors de l’enregistrement du score.\",\"scoreSaveSuccess\":\"Score enregistré avec succès.\",\"settingsLoadFailure\":\"Il y a eu une erreur lors du chargement des paramètres.\",\"signinUrlFailure\":\"Il y a eu une erreur d’obtention d’url de connexion pour le service d’authentification.\",\"summaryLoadFailure\":\"Il y a eu une erreur lors du chargement des données du résumé descriptif.\",\"versionLoadFailure\":\"Il y a eu une erreur lors du chargement de votre version.\"},\"panels\":{\"actor\":\"Utilisateur\",\"close\":\"Fermer\",\"comparison\":\"Graphe comparatif\",\"correction\":\"Grille de correction\",\"sharing\":\"Partage\",\"signin\":\"Identification\",\"summary\":\"Kidoju\"},\"score\":{\"icon\":\"trophy\",\"title\":\"Votre score est {0:p0}\"},\"sharing\":{\"text\":\"Veuillez bien noter et partager votre experience.\"},\"signin\":{\"text\":\"Veuillez vous identifier pour obtenir la correction détaillée.\"},\"stage\":{\"messages\":{\"noPage\":\"Chargement...\"}},\"toolbar\":{\"home\":{\"icon\":\"home\"},\"play\":{\"text\":\"Recommencer\",\"icon\":\"media_play\"},\"review\":{\"text\":\"Correction\",\"icon\":\"window_close\"},\"score\":{\"text\":\"Score\",\"icon\":\"trophy\"},\"submit\":{\"text\":\"Soumettre\",\"icon\":\"auction_hammer\"},\"summary\":{\"text\":\"Détails\",\"icon\":\"document_notebook\",\"edit\":{\"text\":\"Editer\",\"icon\":\"graphics_tablet\"}},\"view\":{\"text\":\"Afficher\",\"icon\":\"windows\",\"actor\":{\"text\":\"User\"},\"comparison\":{\"text\":\"Graphe comparatif\"},\"correction\":{\"text\":\"Grille de correction\"},\"sharing\":{\"text\":\"Partage\"},\"signin\":{\"text\":\"Identification\"},\"summary\":{\"text\":\"Kidoju\"}}}},\"summary\":{\"author\":{\"created\":{\"label\":\"Membre depuis:\"},\"points\":{\"label\":\"Points:\"}},\"comments\":{\"signature\":{\"edit\":\"{0} écrit...\",\"view\":\"{0} a écrit le {1:g}\"}},\"description\":{\"validator\":{\"description\":\"Une description est limitée à 2500 caractères.\"},\"warning\":\"Description manquante.\"},\"dialogs\":{\"editQuestion\":{\"message\":\"Voulez-vous vraiment créer un nouveau brouillon à éditer?\",\"title\":\"Question\"},\"iconEditor\":{\"openDialogFailure\":\"Il y a eu une erreur lors de l’ouverture de la fenêtre.\",\"title\":\"Sélectionnez une icône\"}},\"notifications\":{\"authorLoadFailure\":\"Il y a eu une erreur lors du chargement du profil de l’auteur.\",\"authenticatedUserLoadFailure\":\"Il y a eu une erreur lors du chargement de l’identité de l’utilisateur.\",\"commentsLoadFailure\":\"Il y a eu une erreur lors du chargement des commentaires.\",\"draftCreateFailure\":\"Il y a eu une erreur lors de la création de votre brouillon.\",\"draftPublishFailure\":\"Il y a eu une erreur lors de la publication du brouillon. Assurez-vous que votre brouillon a au moins un composant par page et que la logique de test est complète.\",\"draftPublishSuccess\":\"Le brouillon a été publié avec succès.\",\"missingVersionWarning\":\"Il n’y a pas de version à supprimer, éditer, jouer ou publier. Veuillez cliquer le bouton Editer pour créer une nouvelle version.\",\"publishedVersionWarning\":\"Une version publiée ne peut pas être supprimée ou re-publiée.\",\"ratingFailure\":\"Il y a eu une erreur de notation de la version en cours. Peut-être a-t-elle déjà été notée.\",\"ratingSuccess\":\"La version en cours a été notée avec succès.\",\"settingsLoadFailure\":\"Il y a eu une erreur lors du chargement des paramètres.\",\"summaryLoadFailure\":\"Il y a eu une erreur lors du chargement des données du résumé descriptif.\",\"summaryNotModified\":\"Aucun changement n’a modifié le résumé descriptif enregistré.\",\"summarySaveFailure\":\"Il y a eu une erreur lors de l’enregistrement du résumé descriptif.\",\"summarySaveSuccess\":\"Le résumé descriptif a été enregistré avec succès.\",\"versionDeleteFailure\":\"Il y a eu une erreur lors de la suppression de la version.\",\"versionDeleteSuccess\":\"La version a été supprimée avec succès.\",\"versionsLoadFailure\":\"Il y a eu une erreur lors du chargement des versions.\"},\"panels\":{\"add\":\"Ajouter\",\"author\":\"Auteur\",\"close\":\"Fermer\",\"comments\":\"Commentaires\",\"description\":\"Description\",\"edit\":\"Editer\",\"ok\":\"Sauvegarder\",\"properties\":\"Propriétés\",\"qrcode\":\"QR Code\",\"scores\":\"Scores\",\"share\":\"Partager\",\"statistics\":\"Statistiques\"},\"properties\":{\"ageGroup\":{\"label\":\"Groupe d’Age:\",\"data\":[{\"text\":\"3-5\",\"value\":1},{\"text\":\"5-7\",\"value\":2},{\"text\":\"7-9\",\"value\":4},{\"text\":\"9-11\",\"value\":8},{\"text\":\"11-14\",\"value\":16},{\"text\":\"14-16\",\"value\":32},{\"text\":\"16-18\",\"value\":64},{\"text\":\"18+\",\"value\":128}]},\"category\":{\"label\":\"Catégorie:\"},\"tags\":{\"label\":\"Mots Clés:\",\"placeholder\":\"Saisisez des mots clés séparés par une virgule.\",\"warning\":\"Mot clé manquant.\"},\"title\":{\"label\":\"Titre:\",\"placeholder\":\"Saisissez un titre\"},\"validator\":{\"ageGroup\":\"Un goupe d’âge est requis.\",\"category\":\"Une catégorie est nécessaire.\",\"tags\":\"Un mot clé n’est pas une chaîne de 2 à 25 caractères de long ou a des caractères invalides.\",\"title\":\"Le titre n’est pas une chaîne de 2 à 60 caractères de long ou a des caractères invalides.\"}},\"share\":{\"embed\":{\"tab\":\"Code\"},\"social\":{\"tab\":\"Social\"}},\"statistics\":{\"comments\":{\"label\":\"Comment.:\"},\"created\":{\"label\":\"Créé le:\"},\"published\":{\"label\":\"Publié le:\",\"warning\":\"Non publié\"},\"ratings\":{\"label\":\"Eval.:\"},\"scores\":{\"label\":\"Score Moy.:\"},\"views\":{\"label\":\"Vues:\"}},\"toolbar\":{\"edit\":{\"text\":\"Editer\",\"icon\":\"graphics_tablet\",\"delete\":{\"text\":\"Supprimer\",\"icon\":\"garbage_can_red\"}},\"home\":{\"icon\":\"home\"},\"play\":{\"text\":\"Jouer\",\"icon\":\"media_play\"},\"publish\":{\"text\":\"Publier\",\"icon\":\"cloud_upload\"},\"view\":{\"text\":\"Afficher\",\"icon\":\"windows\",\"author\":{\"text\":\"Author\"},\"comments\":{\"text\":\"Comments\"},\"description\":{\"text\":\"Description\"},\"properties\":{\"text\":\"Properties\"},\"qrcode\":{\"text\":\"QR Code\"},\"scores\":{\"text\":\"Scores\"},\"share\":{\"text\":\"Share\"},\"statistics\":{\"text\":\"Statistics\"}}}},\"user\":{\"activities\":{\"grid\":{\"score\":\"Score\",\"title\":\"Titre\",\"type\":\"Type\",\"date\":\"Le\"}},\"description\":{\"validator\":{\"description\":\"Une description est limitée à 2500 caractères.\"}},\"dialogs\":{\"editQuestion\":{\"message\":\"Voulez-vous vraiment créer un nouveau brouillon à éditer?\",\"title\":\"Question\"}},\"facebook\":{\"email\":{\"label\":\"Email:\"},\"link\":{\"button\":\"Facebook\"},\"name\":{\"label\":\"Nom:\"},\"permissions\":{\"button\":\"Permissions\"},\"revoke\":{\"button\":\"Révoquer\"}},\"google\":{\"email\":{\"label\":\"Email:\"},\"link\":{\"button\":\"Google+\"},\"name\":{\"label\":\"Nom:\"},\"permissions\":{\"button\":\"Permissions\"},\"revoke\":{\"button\":\"Révoquer\"}},\"live\":{\"email\":{\"label\":\"Email:\"},\"link\":{\"button\":\"Windows Live\"},\"name\":{\"label\":\"Nom:\"},\"permissions\":{\"button\":\"Permissions\"},\"revoke\":{\"button\":\"Révoquer\"}},\"notifications\":{\"activitiesLoadFailure\":\"Il y a eu une erreur lors du chargement des activités de l’utilisateur.\",\"draftCreateFailure\":\"Il y a eu une erreur lors de la création de votre brouillon.\",\"missingVersionWarning\":\"Il n’y a pas de version à supprimer, éditer, jouer ou publier. Veuillez cliquer le bouton Editer pour créer une nouvelle version.\",\"settingsLoadFailure\":\"Il y a eu une erreur lors du chargement des paramètres.\",\"summariesLoadFailure\":\"Il y a eu une erreur lors du chargement des projets de l’utilisateur.\",\"userLoadFailure\":\"Il y a eu une erreur lors du chargement du profil utilisateur.\",\"userNotModified\":\"Aucun changement n’a modifié l’utilisateur enregistré.\",\"userSaveFailure\":\"Il y a eu une erreur lors de l’enregistrement de votre profil utilisateur.\",\"userSaveSuccess\":\"Votre profil a été enregistré avec succès.\",\"versionsLoadFailure\":\"Il y a eu une erreur lors du chargement des versions.\"},\"panels\":{\"activities\":\"Activités\",\"close\":\"Fermer\",\"description\":\"Description\",\"edit\":\"Editer\",\"facebook\":\"Facebook\",\"google\":\"Google\",\"live\":\"Windows Live\",\"ok\":\"Sauvegarder\",\"profile\":\"Profil\",\"summaries\":\"Kidojus\",\"twitter\":\"Twitter\"},\"profile\":{\"created\":{\"label\":\"Membre depuis:\"},\"email\":{\"label\":\"Email:\"},\"firstName\":{\"label\":\"Prénom:\"},\"lastName\":{\"label\":\"Nom:\"},\"points\":{\"label\":\"Points:\"}},\"summaries\":{\"grid\":{\"buttons\":{\"edit\":{\"icon\":\"graphics_tablet\",\"text\":\"Editer\"},\"play\":{\"icon\":\"media_play\",\"text\":\"Jouer\"}},\"commands\":\"Commandes\",\"icon\":\"Icône\",\"notifications\":{\"unpublished\":\"Non publié\",\"missingTags\":\"Mot clé manquant\"},\"published\":\"Publié\",\"tags\":\"Mots clés\",\"title\":\"Titre\",\"views\":\"Vues\"}},\"toolbar\":{\"home\":{\"icon\":\"home\"},\"link\":{\"text\":\"Link Account\",\"facebook\":{\"text\":\"Facebook\"},\"google\":{\"text\":\"Google\"},\"live\":{\"text\":\"Live\"},\"twitter\":{\"text\":\"Twitter\"}},\"view\":{\"text\":\"Afficher\",\"icon\":\"windows\",\"activities\":{\"text\":\"Activités\"},\"description\":{\"text\":\"Description\"},\"facebook\":{\"text\":\"Facebook\"},\"google\":{\"text\":\"Google\"},\"live\":{\"text\":\"Windows Live\"},\"profile\":{\"text\":\"Profile\"},\"summaries\":{\"text\":\"Kidojus\"},\"twitter\":{\"text\":\"Twitter\"}}},\"twitter\":{\"email\":{\"label\":\"Email:\"},\"link\":{\"button\":\"Twitter\"},\"name\":{\"label\":\"Nom:\"},\"permissions\":{\"button\":\"Permissions\"},\"revoke\":{\"button\":\"Révoquer\"}}},\"errors\":{\"http\":{\"400\":{\"status\":400,\"title\":\"400 - Mauvaise Requête\",\"message\":\"Désolé, mais votre requête est mal formulée. L’URL est peut-être mal ortographiée.\"},\"401\":{\"status\":401,\"title\":\"401 - Non autorisé\",\"message\":\"Désolé, mais votre requête n’est pas autorisée.\"},\"403\":{\"status\":403,\"title\":\"403 - Interdit\",\"message\":\"Désolé, mais votre requête est interdite.\"},\"404\":{\"status\":404,\"title\":\"404 - Introuvable\",\"message\":\"Désolé, mais la page demandée est introuvable. L’URL est peut-être mal ortographiée ou la page que vous recherchez n’est peut-être plus disponible.\"},\"500\":{\"status\":500,\"title\":\"500 - Erreur Inconnue\",\"message\":\"Il y a eu une erreur inconnue. Si nous arrivons à la reproduire, nous la corrigerons avec amour et attention.\"},\"1000\":{\"status\":403,\"title\":\"1000 - Désactivez le mode privé ou mettez à jour votre navigateur\",\"message\":\"Ce site web utilise les fonctionnalités des navigateurs récents, notamment (mais pas seulement) l’audio et la vidéo, les blobs, les canvas, les transformations css, les api de fichiers, le stockage local et de session, les graphiques vectoriels (SVG) et les « web workers ».\"},\"1001\":{\"status\":401,\"title\":\"401 - Non autorisé\",\"message\":\"Désolé, le service ne vous a pas identifié.\"}},\"mongoose\":{\"validation\":{\"status\":400,\"title\":\"400 - Mauvaise Requête\",\"message\":\"Erreur de validation de base de données.\"}},\"params\":{\"invalidFileId\":{\"status\":404,\"title\":\"404 - Introuvable\",\"message\":\"Identifiant de fichier erroné: veuillez utiliser un nom de 3 à 50 et une extension de 2 à 7 caractères alphanumeriques\"},\"invalidLanguage\":{\"status\":404,\"title\":\"404 - Introuvable\",\"message\":\"Langue erronée: cette langue n’est pas définie.\"},\"invalidMonth\":{\"status\":404,\"title\":\"404 - Introuvable\",\"message\":\"Mois erroné: veuillez utiliser un nombre à quatre chiffres compris entre 01 et 12.\"},\"invalidObjectId\":{\"status\":404,\"title\":\"404 - Introuvable\",\"message\":\"Identifiant d’objet erroné: un identifiant est une chaîne de 24 caractères hexadécimaux.\"},\"invalidProvider\":{\"status\":404,\"title\":\"404 - Introuvable\",\"message\":\"Service erroné: utlisez `facebook`, `google`, `live` ou `twitter`\"},\"invalidYear\":{\"status\":404,\"title\":\"404 - Introuvable\",\"message\":\"Année erronée: veuillez utiliser un nombre à quatre chiffres compris entre 2014 et l’année en cours.\"}}}}");

/***/ })

}]);
//# sourceMappingURL=app-culture-fr-es6.bundle.js.map?v=0.3.8
