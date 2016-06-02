/**
 * Copyright (c) 2013-2016 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint node: true */

'use strict';

var nconf = require('nconf');
var util = require('util');
var async = require('async');
var AWS = require('aws-sdk');

var Memory = nconf.Memory;

/**
 * Store that reads data from an AWS S3 object.
 * @see http://blogs.aws.amazon.com/security/post/Tx610S2MLVZWEA/Using-IAM-roles-to-distribute-non-AWS-credentials-to-your-EC2-instances
 * @see https://github.com/TeamPraxis/nconf-aws/blob/master/lib/index.js
 **/
var AWSS3 = exports.AWSS3 = function (options) {
    if (!options || !options.bucket) {
        throw new Error ('Missing required option `bucket`');
    }
    if (!options || !options.key) {
        throw new Error ('Missing required option `key`');
    }

    Memory.call(this, options);
    this.type = 'awss3';
    this.readOnly = false;
    this.bucket = options.bucket;
    this.key = options.key;
    this.format = options.format || nconf.formats.json;
};

// Inherit from the Memory store
util.inherits(AWSS3, Memory);

// set this on nconf so it knows how to find us
nconf.Awss3 = AWSS3;

/**
 * Load the data from the AWS bucket into the store.
 **/
AWSS3.prototype.load = function (callback) {
    var self = this;

    /* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */

    async.waterfall(
        [
            // use meta to retrieve the region if not already set
            function (waterfall_cb) {
                if (!AWS.config.region && !nconf.get('awss3:region')) {
                    var meta = new AWS.MetadataService();
                    meta.request('/latest/dynamic/instance-identity/document', waterfall_cb);
                } else {
                    waterfall_cb(null, null);
                }
            },
            // try to load from S3
            function (body, waterfall_cb) {
                var data = {};
                if (body) {
                    data = JSON.parse(body);
                }
                self.region = AWS.config.region || nconf.get('awss3:region') || data.region;
                var s3 = new AWS.S3({
                    apiVersion: '2006-03-01',
                    region: self.region
                });
                s3.getObject({ Bucket: self.bucket, Key: self.key }, waterfall_cb);
            }
        ],
        function (error, s3data) {
            if (!error && s3data) {
                try {
                    self.store = self.format.parse(s3data.Body.toString());
                } catch (ex) {
                    callback(new Error('Error parsing configuration file https://s3-' + self.region + '.amazonaws.com/' + self.bucket + '/' + self.key));
                    return;
                }
                callback(null, self.store);
            } else {
                callback(error || new Error('Error loading configuration file https://s3-' + self.region + '.amazonaws.com/' + self.bucket + '/' + self.key));
            }
        }
    );

    /* jscs:enable requireCamelCaseOrUpperCaseIdentifiers */

};

/**
 * Delete loadSync so nconf.load doesn't try to use it.
 **/
AWSS3.prototype.loadSync = null;

/**
 * Return true to check whether AWS S3 is used to store config files
 * @type {boolean}
 */
module.exports = true;
