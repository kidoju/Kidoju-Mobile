/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

import __ from '../app/app.i18n.es6';
import themer from '../app/app.themer.es6';

const initializers = [
    // Add initializers here
    // Make sure they all return a jQuery promise
    // Themed styles
    themer.load(),
    // i18n Culture
    __.load(),
];

export default initializers;
