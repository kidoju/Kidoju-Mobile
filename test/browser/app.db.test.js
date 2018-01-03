/**
 * Copyright (c) 2013-2017 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true, jquery: true, expr: true, mocha: true */

;(function ($, undefined) {

    'use strict';

    var expect = window.chai.expect;
    var sinon = window.sinon;
    var kendo = window.kendo;
    var pongodb = window.pongodb;
    var UNDEFINED = 'undefined';
    var Database = kendo.Class.extend({
        init: function (options) {
            this._version = options.version;
        },
        version: function (value) {
            if ($.type(value) === UNDEFINED) {
                return $.Deferred().resolve(this._version).promise();
            } else {
                this._version = value;
                return $.Deferred().resolve().promise();
            }
        }
    });

    function script() {
        var that = this;
        var dfd = $.Deferred();
        var count = 0;
        var interval = setInterval(function () {
            count ++;
            dfd.notify({ version: that._version, pass: 1, percent: count / 10 });
            if (count === 10) {
                clearInterval(interval);
                dfd.resolve();
            }
        }, 10);
        return dfd.promise();
    }

    describe('Upgrade', function () {

        var db;
        var spy = sinon.spy();

        beforeEach(function () {
            db = new Database({ version: '0.1.0' });
        });

        it('it should upgrade', function (done) {

            var upgrade = new pongodb.Upgrade({ db: db });
            upgrade.push(new pongodb.Migration({
                version: '0.1.0',
                scripts: [ script ]
            }));
            upgrade.push(new pongodb.Migration({
                version: '0.1.1',
                scripts: [ script ]
            }));
            upgrade.push(new pongodb.Migration({
                version: '0.1.2',
                scripts: [ script ]
            }));
            upgrade.execute()
                .progress(function (state) {
                    spy();
                })
                .always(function () {
                    db.version()
                        .done(function (version) {
                            expect(spy).to.have.callCount(20);
                            expect(version).to.equal('0.1.2');
                        })
                        .always(function () {
                            done();
                        });
                });

        });

    });


}(window.jQuery));
