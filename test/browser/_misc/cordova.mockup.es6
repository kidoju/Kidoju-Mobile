/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

function noop() {}

window.cordova = {};

/**
 * Dialogs
 * @type {{confirm: (message?: string, _default?: string) => (string | null), beep: noop, alert: noop, prompt: noop}}
 */
window.navigator.notification = {
    alert: noop,
    confirm: noop,
    prompt: noop,
    beep: noop
};

/**
 * Splahscreen
 * @type {{hide: noop, show: noop}}
 */
window.navigator.splashscreen = {
    hide: noop,
    show: noop
};

setTimeout(() => {
    window.dispatchEvent(new Event('deviceready'));
}, 2000);
