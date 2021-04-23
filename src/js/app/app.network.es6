/**
 * Copyright (c) 2013-2021 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

import Network from '../common/window.network.es6';
import config from './app.config.jsx';

/**
 * network connection monitoring
 */
const network = new Network({
    // @ see http://api.jquery.com/jquery.ajax/
    ajax: {
        url: config.uris.rapi.ping,
        timeout: 5000,
    },
    enabled: true,
    global: false,
});

/**
 * Default export
 */
export default network;
