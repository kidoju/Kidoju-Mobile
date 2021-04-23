/**
 * Copyright (c) 2019-2021 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// Note: requires phonegap-plugin-barcodescanner
// so window.cordova.plugins.barcodeScanner is only available after deviceready event

const plugin = {
    /**
     * Ready
     * @returns {boolean}
     */
    ready() {
        return !!((window.cordova || {}).plugins || {}).barcodeScanner;
    },

    /**
     * Scan
     * @param success
     * @param error
     * @param options
     */
    scan(success, error, options) {
        const { barcodeScanner } = (window.cordova || {}).plugins || {};
        if (barcodeScanner && typeof barcodeScanner.scan === 'function') {
            barcodeScanner.scan(success, error, options);
        }
    }
};

/**
 * Default export
 */
export default plugin;
