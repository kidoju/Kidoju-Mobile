/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

import activities from './ui.activities.es6';
import categories from './ui.categories.es6';
import correction from './ui.correction.es6';
import drawer from './ui.drawer.es6';
import error from './ui.error.es6';
import layout from './ui.layout.es6';
import finder from './ui.finder.es6';
import network from './ui.network.es6';
import notification from './ui.notification.es6';
import player from './ui.player.es6';
import score from './ui.score.es6';
import settings from './ui.settings.es6';
import signin from './ui.signin.es6';
import stage from './ui.stage.es6';
import summary from './ui.summary.es6';
import sync from './ui.sync.es6';
import user from './ui.user.es6';
import versions from './ui.versions.es6';

const features = [
    // Add features here
    // Beware, there is no consistent rule as to what `this` refers to in feature methods
    // because the Kendo UI framework will bind (via proxy) these methods when referred to in the HTML page via MVVM
    drawer,
    layout,
    error,
    activities,
    categories,
    correction,
    finder,
    network,
    notification,
    player,
    score,
    settings,
    signin,
    stage,
    summary,
    sync,
    user,
    versions,
];

export default features;
