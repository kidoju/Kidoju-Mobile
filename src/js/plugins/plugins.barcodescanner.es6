/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// Note: requires phonegap-plugin-barcodescanner
// so plugin.scan is only available after deviceready event

/**
 * BarCodeScanner plugin
 */
const plugin = {
    /**
     * Ready
     * @returns {boolean}
     */
    ready() {
        const { barcodeScanner } = (window.cordova || {}).plugins || {};
        return barcodeScanner && typeof barcodeScanner.scan === 'function';
    },

    /**
     * Scan
     * @param success
     * @param error
     * @param options
     */
    scan(success, error, options) {
        if (plugin.ready()) {
            window.cordova.plugins.barcodeScanner.scan(success, error, options);
        }
    }
};

/**
 * Default export
 */
export default plugin;
