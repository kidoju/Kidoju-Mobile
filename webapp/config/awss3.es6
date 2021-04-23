/**
 * Copyright (c) 2013-2021 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

const nconf = require('nconf');
const waterfall = require('async/waterfall');
const AWS = require('aws-sdk');

const { Memory } = nconf;

/**
 * Store that reads data from an AWS S3 object.
 * @see http://blogs.aws.amazon.com/security/post/Tx610S2MLVZWEA/Using-IAM-roles-to-distribute-non-AWS-credentials-to-your-EC2-instances
 * @see https://github.com/TeamPraxis/nconf-aws/blob/master/lib/index.js
 * */
class AWSS3 extends Memory {
    /**
     * Constructor
     * @constructor
     * @param options
     */
    constructor(options) {
        if (!options || !options.bucket) {
            throw new Error('Missing required option `bucket`');
        }
        if (!options || !options.key) {
            throw new Error('Missing required option `key`');
        }

        super(options);
        this.type = 'awss3';
        this.readOnly = false;
        this.bucket = options.bucket;
        this.key = options.key;
        this.format = options.format || nconf.formats.json;
    }

    /**
     * Load the data from the AWS bucket into the nconf store.
     * Note: Cannot be promisified because method signature is determines by nconf
     * @see https://github.com/indexzero/nconf/blob/391665cc38412ce47c31c9f0eea8da6e76fe2663/lib/nconf/provider.js#L427
     */
    load(callback) {
        const self = this;
        waterfall(
            [
                // use meta to retrieve the region if not already set
                (waterfallCb) => {
                    if (!AWS.config.region && !nconf.get('awss3:region')) {
                        const meta = new AWS.MetadataService();
                        meta.request(
                            '/latest/dynamic/instance-identity/document',
                            waterfallCb
                        );
                    } else {
                        waterfallCb(null, null);
                    }
                },
                // try to load from S3
                (body, waterfallCb) => {
                    let data = {};
                    if (body) {
                        data = JSON.parse(body);
                    }
                    self.region =
                        AWS.config.region ||
                        nconf.get('awss3:region') ||
                        data.region;
                    const s3 = new AWS.S3({
                        apiVersion: '2006-03-01',
                        region: self.region,
                    });
                    s3.getObject(
                        { Bucket: self.bucket, Key: self.key },
                        waterfallCb
                    );
                },
            ],
            (error, s3data) => {
                if (!error && s3data) {
                    try {
                        self.store = self.format.parse(s3data.Body.toString());
                    } catch (ex) {
                        callback(
                            new Error(
                                `Error parsing configuration file https://s3-${self.region}.amazonaws.com/${self.bucket}/${self.key}`
                            )
                        );
                        return;
                    }
                    callback(null, self.store);
                } else {
                    callback(
                        error ||
                            new Error(
                                `Error loading configuration file https://s3-${self.region}.amazonaws.com/${self.bucket}/${self.key}`
                            )
                    );
                }
            }
        );
    }

    /**
     * Hide loadSync so nconf.load doesn't try to use it.
     */
    // eslint-disable-next-line class-methods-use-this
    get loadSync() {
        return null;
    }
}

// set AWSS3 on nconf
nconf.Awss3 = AWSS3;

/**
 * Makes it possible to check that AWS S3 is used to store config files
 * @type {boolean}
 */
module.exports = AWSS3;
