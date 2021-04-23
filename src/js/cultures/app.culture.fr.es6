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
import mobile from './mobile.fr.es6';
// import tools from './tools.fr.es6';
import webapp from '../../../webapp/locales/fr.json';

import './kendo.fixes.fr.es6';

/**
 * Kendo UI resources
 */
import '../vendor/kendo/cultures/kendo.culture.fr-FR';
import '../vendor/kendo/messages/kendo.messages.fr-FR';
import './widgets.fr.es6';

/**
 * Requires kendo.core
 */
window.kendo.culture('fr-FR');

/**
 * Default export
 */
export default {
    mobile,
    webapp,
};
