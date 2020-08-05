/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/**
 * Application resources
 */
// import data from './data.en.es6';
// import dialogs from './dialogs.en.es6';
// import editors from './editors.en.es6';
// import libraries from './libraries.en.es6';
import mobile from './mobile.en.es6';
// import tools from './tools.en.es6';
// import webapp from '../../../webapp/locales/en.json';
import './kendo.fixes.en.es6';
import app from '../common/window.global.es6';

/**
 * Kendo UI resources
 */
import '../vendor/kendo/cultures/kendo.culture.en-GB';
import '../vendor/kendo/messages/kendo.messages.en-GB';
import './widgets.en.es6';

window.kendo.culture('en-GB'); // TODO requires 'kendo.core'

app.cultures = app.cultures || {};
app.cultures.en = mobile;
