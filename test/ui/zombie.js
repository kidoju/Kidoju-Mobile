/**
 * Copyright (c) 2013-2014 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba/Kidoju-Platform
 */

/* jslint node: true */
/* jshint node: true */

"use strict";

var Browser = require('zombie');
var expect = require('chai').expect;

describe('Test zombie.js', function() {

    before(function(done) {
        require('../../nodejs/http.server.js');
        this.browser = new Browser();
        this.browser.visit('http://localhost:8080/www/index.html', done);
    });

    describe('When page is loaded', function() {
        it('It should have a main list', function() {
            expect(this.browser.query("#main-list")).to.be.ok;
            //assert.lengthOf(browser.body.queryAll(".hand"), 2);
        });
    });

    //after(function(done) {
    //this.server.close(done);
    //});

});

//mocha.run();



