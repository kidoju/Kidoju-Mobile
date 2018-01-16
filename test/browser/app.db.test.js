/**
 * Copyright (c) 2013-2017 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true, jquery: true, expr: true, mocha: true */

;(function ($, undefined) {

    'use strict';

    var expect = window.chai.expect;
    var sinon = window.sinon;
    var pongodb = window.pongodb;
    var TOTAL = 10;

    function script(db) {
        var dfd = $.Deferred();
        var count = 0;
        var interval = setInterval(function () {
            count++;
            dfd.notify({ version: db._version, pass: 1, percent: count / TOTAL });
            if (count === TOTAL) {
                clearInterval(interval);
                dfd.resolve();
            }
        }, 10);
        return dfd.promise();
    }

    describe('Upgrade', function () {

        var db;
        var spy = sinon.spy();

        beforeEach(function (done) {
            db = new pongodb.Database({ name: 'Dummy' });
            db.version('0.1.0').always(function () { done(); });
        });

        it('it should upgrade', function (done) {

            db.upgrade.push(new pongodb.Migration({
                version: '0.1.0',
                scripts: [script]
            }));
            db.upgrade.push(new pongodb.Migration({
                version: '0.1.1',
                scripts: [script]
            }));
            db.upgrade.push(new pongodb.Migration({
                version: '0.1.2',
                scripts: [script]
            }));
            db.upgrade.execute()
                .progress(function (state) {
                    spy();
                })
                .always(function () {
                    db.version()
                        .done(function (version) {
                            // 10 times for version 0.1.1 and another 10 times for version 0.1.2
                            // considering it should not execute scripts fom version 0.1.0
                            expect(spy).to.have.callCount(2 * TOTAL);
                            expect(version).to.equal('0.1.2');
                        })
                        .always(function () {
                            done();
                        });
                });

        });

        afterEach(function () {
            // TODO Drop databases
        });

    });


}(window.jQuery));
