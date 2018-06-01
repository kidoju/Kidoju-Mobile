/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* eslint-disable no-unused-expressions */

import $ from 'jquery';
import chai from 'chai';
import sinon from 'sinon';
import 'sinon-chai';
import '../../js/window.pongodb';

const { afterEach, beforeEach, describe, it, pongodb } = window;
const { expect } = chai;
const TOTAL = 10;

function script(db) {
    const dfd = $.Deferred();
    let count = 0;
    const interval = setInterval(() => {
        count += 1;
        dfd.notify({ version: db._version, pass: 1, percent: count / TOTAL });
        if (count === TOTAL) {
            clearInterval(interval);
            dfd.resolve();
        }
    }, 10);
    return dfd.promise();
}

describe('app.db', () => {
    let db;
    const spy = sinon.spy();

    beforeEach(done => {
        db = new pongodb.Database({
            name: 'Dummy'
        });
        db.version('0.1.0').always(() => done());
    });

    it('it should upgrade', done => {
        db.upgrade.push(
            new pongodb.Migration({
                version: '0.1.0',
                scripts: [script]
            })
        );
        db.upgrade.push(
            new pongodb.Migration({
                version: '0.1.1',
                scripts: [script]
            })
        );
        db.upgrade.push(
            new pongodb.Migration({
                version: '0.1.2',
                scripts: [script]
            })
        );
        db.upgrade
            .execute()
            .progress(state => {
                spy(state);
            })
            .always(() => {
                db.version()
                    .done(version => {
                        // 10 times for version 0.1.1 and another 10 times for version 0.1.2
                        // considering it should not execute scripts fom version 0.1.0
                        expect(spy).to.have.callCount(2 * TOTAL);
                        expect(version).to.equal('0.1.2');
                    })
                    .always(() => {
                        done();
                    });
            });
    });

    afterEach(() => {
        // TODO Drop databases
    });
});
