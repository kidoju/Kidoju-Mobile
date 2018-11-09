/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

import assert from '../common/window.assert.es6';
import { error2xhr } from './data.util.es6';
import LazyRemoteTransport from './transports.remote.lazy.es6';

/**
 * RemoteTransport (all CRUD operations with rapi)
 */
const RemoteTransport = LazyRemoteTransport.extend({
    /**
     * Create
     * @param options
     */
    create(options) {
        assert.crud(options);
        const data = this.parameterMap(options.data, 'create');
        // Validate data against partition
        const err = this._validate(data);
        if (err) {
            options.error(...error2xhr(err));
        } else {
            // Execute request
            this._collection
                .create(data)
                .then(options.success)
                .catch(options.error);
        }
    },

    /**
     * Destroy
     * @param options
     */
    destroy(options) {
        assert.crud(options);
        const data = this.parameterMap(options.data, 'destroy');
        // Validate data against partition
        const err = this._validate(data);
        if (err) {
            options.error(...error2xhr(err));
        } else {
            // Execute request
            this._collection
                .destroy(data[this.idField()])
                .then(options.success)
                .catch(options.error);
        }
    },

    /**
     * Update
     * @param options
     */
    update(options) {
        assert.crud(options);
        const data = this.parameterMap(options.data, 'update');
        // Validate data against partition
        const err = this._validate(data);
        if (err) {
            options.error(...error2xhr(err));
        } else {
            // Execute request
            this._collection
                .update(data[this.idField()], data)
                .then(options.success)
                .catch(options.error);
        }
    }
});

/**
 * Default export
 */
export default RemoteTransport;
