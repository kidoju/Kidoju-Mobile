/**
 * Copyright (c) 2013-2014 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba/Kidoju-Platform
 */

/* jslint browser: true */
/* jshint browser: true */

"use strict";

function assert(expected, actual) {
    for (var prop in expected) {
        if (expected.hasOwnProperty(prop)) {
            //expect(actual).to.have.property(prop, expected[prop]); does not work with arrays
            expect(actual).to.have.property(prop);
            if (actual[prop] instanceof Object) { //including Array
                expect(actual[prop]).to.eql(expected[prop]); //deep equal
            } else if (actual[prop] instanceof Date) {
                expect(actual[prop].getTime()).to.equal(expected[prop].getTime());
            } else {
                expect(actual[prop]).to.equal(expected[prop]);
            }
        }
    }
}

var created;
function waitForDB(count) {
    if (count === undefined) count = 10;
    if(count < 0) {
        throw new Error('waitForDB is taking too long');
    } else {
        if (!created) {
            setTimeout(waitForDB(count - 1), 200);
        }
    }
}

var content_id1, content_id2, activity_id1, activity_id2;
function waitForData(count) {
    if (count === undefined) count = 10;
    if (count < 0) {
        throw new Error('waitForData is taking too long');
    } else {
        if (!(content_id1 && content_id2 && activity_id1 && activity_id2)) {
            setTimeout(waitForData(count - 1), 200);
        }
    }
}


describe('Test app.db.js', function() {

    before(function(done) {
        console.log('app.db expected here');
        //See https://github.com/axemclion/jquery-indexeddb/blob/gh-pages/test/index.html
        app.db.drop().done(done);
    });

    describe('When opening the database', function() {
        it('We expect success', function(done) {
            app.db.open().done(function(db){
                expect(db).to.have.property('name', 'KidojuDB');
                expect(db).to.have.property('version', 1);
                if (!/Apple/.test(navigator.vendor)) {
                    expect(db.objectStoreNames).to.be.instanceof(DOMStringList);
                }
                expect(db.objectStoreNames).to.have.property('length', 2);
                var objectStoreNames = {};
                objectStoreNames[db.objectStoreNames[0]] = true;
                objectStoreNames[db.objectStoreNames[1]] = true;
                expect(objectStoreNames).to.have.property('activities');
                expect(objectStoreNames).to.have.property('contents');
                created = true;
                done();
            }).fail(function(err){
                expect(err).to.be.null; //Hopefully this is caught here
                expect(false).to.be.true; //At least this won't pass
                done();
            });
        });
    });

    describe('When inserting a record into the database', function() {
        it('We expect success for content1', function(done) {
            waitForDB();
            app.db.collection('contents').insert(testData.content1).done(function(id, event){
                expect(event).to.have.property('type', 'success');
                expect(id).to.equal(testData.content1.id);
                content_id1 = id;
                done();
            }).fail(function(err){
                expect(err).to.be.null;
                expect(false).to.be.true;
                done();
            });
        });
        it('We expect success for content2', function(done) {
            waitForDB();
            app.db.collection('contents').insert(testData.content2).done(function(id, event){
                expect(event).to.have.property('type', 'success');
                expect(id).to.equal(testData.content2.id);
                content_id2 = id;
                done();
            }).fail(function(err){
                expect(err).to.be.null;
                expect(false).to.be.true;
                done();
            });
        });
        it('We expect success for activity1', function(done) {
            waitForDB();
            app.db.collection('activities').insert(testData.activity1).done(function(id, event){
                expect(event).to.have.property('type', 'success');
                expect(id).to.equal(testData.activity1.id);
                activity_id1 = id;
                done();
            }).fail(function(err){
                expect(err).to.be.null;
                expect(false).to.be.true;
                done();
            });
        });
        it('We expect success for activity2', function(done) {
            waitForDB();
            app.db.collection('activities').insert(testData.activity2).done(function(id, event){
                expect(event).to.have.property('type', 'success');
                expect(id).to.equal(testData.activity2.id);
                activity_id2 = id;
                done();
            }).fail(function(err){
                expect(err).to.be.null;
                expect(false).to.be.true;
                done();
            });
        });
    });

    describe('When retrieving a record from the database', function() {
        it('We expect to retrieve content1', function(done) {
            waitForData();
            app.db.collection('contents').find(testData.content1.id).done(function(result, event){
                expect(event).to.have.property('type', 'success');
                assert(result, testData.content1);
                done();
            }).fail(function(err){
                expect(err).to.be.null;
                expect(false).to.be.true;
                done();
            });
        });
        it('We expect to retrieve content2', function(done) {
            waitForData();
            app.db.collection('contents').find(testData.content2.id).done(function(result, event){
                expect(event).to.have.property('type', 'success');
                assert(result, testData.content2);
                done();
            }).fail(function(err){
                expect(err).to.be.null;
                expect(false).to.be.true;
                done();
            });
        });
        it('We expect to retrieve activity1', function(done) {
            waitForData();
            app.db.collection('activities').find(testData.activity1.id).done(function(result, event){
                expect(event).to.have.property('type', 'success');
                assert(result, testData.activity1);
                done();
            }).fail(function(err){
                expect(err).to.be.null;
                expect(false).to.be.true;
                done();
            });
        });
        it('We expect to retrieve activity2', function(done) {
            waitForData();
            app.db.collection('activities').find(testData.activity2.id).done(function(result, event){
                expect(event).to.have.property('type', 'success');
                assert(result, testData.activity2);
                done();
            }).fail(function(err){
                expect(err).to.be.null;
                expect(false).to.be.true;
                done();
            });
        });
    });

    describe('When updating a record in the database', function() {
        it('We expect success for content1', function(done) {
            waitForData();
            testData.content1.title = "My updated title for content1";
            app.db.collection('contents').update(testData.content1).done(function(id, event){
                expect(event).to.have.property('type', 'success');
                expect(id).to.equal(testData.content1.id);
                done();
            }).fail(function(err, exception){
                expect(err).to.be.null;
                expect(false).to.be.true;
                done();
            });
        });
        it('We expect success for content2', function(done) {
            waitForData();
            testData.content2.title = "My updated title for content2";
            app.db.collection('contents').update(testData.content2).done(function(id, event){
                expect(event).to.have.property('type', 'success');
                expect(id).to.equal(testData.content2.id);
                done();
            }).fail(function(err, exception){
                expect(err).to.be.null;
                expect(false).to.be.true;
                done();
            });
        });
        it('We expect success for activity1', function(done) {
            waitForData();
            testData.activity1.text = "My updated comment for activity1";
            app.db.collection('activities').update(testData.activity1).done(function(id, event){
                expect(event).to.have.property('type', 'success');
                expect(id).to.equal(testData.activity1.id);
                done();
            }).fail(function(err, exception){
                expect(err).to.be.null;
                expect(false).to.be.true;
                done();
            });
        });
        it('We expect success for activity2', function(done) {
            waitForData();
            testData.activity2.value = 5;
            app.db.collection('activities').update(testData.activity2).done(function(id, event){
                expect(event).to.have.property('type', 'success');
                expect(id).to.equal(testData.activity2.id);
                done();
            }).fail(function(err, exception){
                expect(err).to.be.null;
                expect(false).to.be.true;
                done();
            });
        });
    });


});