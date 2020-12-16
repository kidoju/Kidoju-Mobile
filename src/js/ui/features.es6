/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

import categories from './ui.categories.es6';
import drawer from './ui.drawer.es6';
import layout from './ui.layout.es6';
import network from './ui.network.es6';
import signin from './ui.signin.es6';

const features = [
    // Add features here
    // Beware, there is no consistent rule as to what `this` refers to in feature methods
    // because the Kendo UI framework will bind (via proxy) these methods when referred to in the HTML page via MVVM
    drawer,
    layout,
    // activities,
    categories,
    network,
    // settings,
    signin,
    // summaries,
    // summary,
    // user
    // user,
];

export default features;
