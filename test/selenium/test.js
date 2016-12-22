/**
 * Copyright (c) 2013-2016 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint node: true, mocha: true, expr: true */
/* globals browser: false */

'use strict';

var expect = require('chai').expect;
// var util = require('util');

describe('index.html', function () {

    before(function (done) {
        browser.url('/index.html');
        // Note: it won't work in PhantomJS without settings the window size
        browser.windowHandleSize({ width:1280, height:800 });
    });

    it('should have the right title - the fancy generator way', function () {
        browser.logger.info(browser.getUrl());
        var title = browser.getTitle();
        expect(title).to.equal('Kidoju.Mobile');
    });
});
