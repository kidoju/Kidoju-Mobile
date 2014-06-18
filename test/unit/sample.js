/**
 * Copyright (c) 2013-2014 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba/Kidoju-Platform
 */

/* jslint browser: true, jquery: true */
/* jshint browser: true, jquery: true */
/* global describe, it, before, expect */

;(function() {

    'use strict';

    describe('Sample Test', function () {

        describe('When doing something', function () {
            it('We expect something else', function (done) {
                expect(true).to.equal(true);
                done();
            });
        });

    });

}());