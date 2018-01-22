/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint browser: true, jquery: true, expr: true, mocha: true */

;(function ($, undefined) {

    'use strict';

    var expect = window.chai.expect;
    var localforage = window.localforage;
    var pongodb = window.pongodb;
    var ObjectId = pongodb.ObjectId;
    var Database = pongodb.Database;
    var Collection = pongodb.Collection;
    var RX_MONGODB_ID = /^[0-9a-f]{24}$/;

    var LF_DB = 'lf_db';
    var STORE1 = 'store1';
    var STORE2 = 'store2';
    var KEY1 = 'key1';
    var KEY2 = 'key2';
    var VALUE1 = 'A simple test 1';
    var VALUE2 = 'A simple test 2';

    var PONGO_DB = 'pongo_db';
    var HEROES = 'heroes';
    var MOVIES = 'movies';
    var HERO1 = {
        firstName: 'Peter',
        lastName: 'Parker'
    };
    var HERO2 = {
        firstName: 'Clark',
        lastName: 'Kent'
    };
    var HERO3 = {
        firstName: 'Bruce',
        lastName: 'Wayne'
    };
    var MOVIE1 = {
        title: 'The Amazing Spider-Man',
        year: 2012
    };
    var MOVIE2 = {
        title: 'Man of Steel',
        year: 2013
    };
    var MOVIE3 = {
        title: 'The Dark Knight Rises',
        year: 2012
    };


    describe('localforage', function () {

        describe('Static', function () {

            it('it should write', function (done) {
                localforage.setItem(KEY1, VALUE1, function (err, value) {
                    expect(err).to.be.null;
                    expect(value).to.equal(VALUE1);
                    done();
                });
            });

            it('it should read', function (done) {
                localforage.getItem(KEY1, function (err, value) {
                    expect(err).to.be.null;
                    expect(value).to.equal(VALUE1);
                    done();
                });
            });

            it('it should clear', function (done) {
                localforage.clear(function (err) {
                    expect(err).to.be.null;
                    done();
                });
            });
        });

        describe('Instance', function () {
            var db = {};

            before(function (done) {
                db[STORE1] = localforage.createInstance({
                    name: LF_DB,
                    storeName: STORE1
                });
                db[STORE2] = localforage.createInstance({
                    name: LF_DB,
                    storeName: STORE2
                });
                db[STORE2].length(function (err, length) {
                    done();
                });
            });

            it('it should write to ' + STORE1, function (done) {
                db[STORE1].setItem(KEY1, VALUE1, function (err, value) {
                    expect(err).to.be.null;
                    expect(value).to.equal(VALUE1);
                    done();
                });
            });

            it('it should write to ' + STORE2, function (done) {
                db[STORE2].setItem(KEY2, VALUE2, function (err, value) {
                    expect(err).to.be.null;
                    expect(value).to.equal(VALUE2);
                    done();
                });
            });

            it('it should read ' + KEY1 + ' from ' + STORE1, function (done) {
                db[STORE1].getItem(KEY1, function (err, value) {
                    expect(err).to.be.null;
                    expect(value).to.equal(VALUE1);
                    done();
                });
            });

            it('it should read ' + KEY2 + ' from ' + STORE2, function (done) {
                db[STORE2].getItem(KEY2, function (err, value) {
                    expect(err).to.be.null;
                    expect(value).to.equal(VALUE2);
                    done();
                });
            });

            it('it should fail to read ' + KEY2 + ' from ' + STORE1, function (done) {
                db[STORE1].getItem(KEY2, function (err, value) {
                    expect(err).to.be.null;
                    expect(value).to.be.null;
                    done();
                });
            });

            it('it should fail to read ' + KEY1 + ' from ' + STORE2, function (done) {
                db[STORE2].getItem(KEY1, function (err, value) {
                    expect(err).to.be.null;
                    expect(value).to.be.null;
                    done();
                });
            });

            it('it should remove ' + KEY1 + ' from ' + STORE1, function (done) {
                db[STORE1].removeItem(KEY1, function (err) {
                    expect(err).to.be.null;
                    done();
                });
            });

            it('it should remove ' + KEY2 + ' from ' + STORE2, function (done) {
                db[STORE2].removeItem(KEY2, function (err) {
                    expect(err).to.be.null;
                    done();
                });
            });

            it('it should clear ' + STORE1, function (done) {
                db[STORE1].clear(function (err) {
                    expect(err).to.be.null;
                    done();
                });
            });

            it('it should clear ' + STORE2, function (done) {
                db[STORE2].clear(function (err) {
                    expect(err).to.be.null;
                    done();
                });
            });

            xit('it should drop store1', function (done) {
                localforage.dropInstance({ name: LF_DB, storeName: STORE1 }, function (err) {
                    expect(err).to.be.null;
                    done();
                });
            });

            xit('it should drop store2', function (done) {
                localforage.dropInstance({ name: LF_DB, storeName: STORE2 }, function (err) {
                    expect(err).to.be.null;
                    done();
                });
            });

            xit('it should drop local-forage-detect-blob-support', function (done) {
                localforage.dropInstance({ name: LF_DB, storeName: 'local-forage-detect-blob-support' }, function (err) {
                    expect(err).to.be.null;
                    done();
                });
            });

            xit('it should drop a database', function (done) {
                localforage.dropInstance({ name: LF_DB }, function (err) {
                    expect(err).to.be.null;
                    done();
                });
            });
        });

    });

    describe('pongodb', function () {

        describe('ObjectId', function () {

            it('constructor with invalid params', function () {
                var fn1 = function () {
                    var objectId = new ObjectId('abcd1234');
                };
                var fn2 = function () {
                    var objectId = new ObjectId(100);
                };
                expect(fn1).to.throw(Error);
                expect(fn2).to.throw(Error);
            });

            it('constructor with valid params', function () {
                var id = '9876543210abcdef98765432';
                var objectId = new ObjectId(id);
                expect(objectId.isMobileId()).to.be.false;
                expect(objectId.toString()).to.equal(id);
            });

            it('constructor without param', function () {
                var now = new Date();
                var objectId = new ObjectId();
                expect(objectId.isMobileId()).to.be.true;
                expect(objectId.toString()).to.match(RX_MONGODB_ID);
                expect(objectId.toString()).to.equal(objectId.toMobileId());
                var diff =  Math.abs(objectId.getTimestamp() - now);
                expect(diff).to.be.lte(1000); // 1000 ms = 1 sec
            });

        });

        describe('Database', function () {

            before(function (done) {
                // Hopefully this works since it has not been tested
                // Note: we would rather drop the entire database
                var db = new Database({ name: PONGO_DB, collections: [HEROES, MOVIES] });
                $.when(
                    db[HEROES].clear(),
                    db[MOVIES].clear()
                )
                    .always(done);
            });

            it('Database constructor with invalid params', function () {
                var fn1 = function () {
                    var db = new Database(); // missing name
                };
                var fn2 = function () {
                    var db = new Database({ name: { x: 1, y: false } }); // invalid name
                };
                var fn3 = function () {
                    var db = new Database({ collections: { x: 1, y: false }  }); // invalid collectons
                };
                expect(fn1).to.throw(TypeError);
                expect(fn2).to.throw(TypeError);
                expect(fn3).to.throw(TypeError);
            });

            it('Database constructor with valid params', function () {
                var db = new Database({ name: PONGO_DB, collections: [HEROES, MOVIES] });
                expect(db).to.be.an.instanceof(Database);
                expect(db).to.have.property(HEROES).that.is.an.instanceof(Collection);
                expect(db).to.have.property(MOVIES).that.is.an.instanceof(Collection);
            });

            it('it should INSERT into collection 1 with id', function (done) {
                var db = new Database({ name: PONGO_DB, collections: [HEROES, MOVIES] });
                expect(db).to.be.an.instanceof(Database);
                expect(db).to.have.property(HEROES).that.is.an.instanceof(Collection);
                HERO1 = $.extend(HERO1, { id: (new ObjectId()).toString() });
                HERO2 = $.extend(HERO2, { id: (new ObjectId()).toString() });
                $.when(
                    db[HEROES].insert(HERO1),
                    db[HEROES].insert(HERO2)
                )
                    .done(function (doc1, doc2, doc3) {
                        expect(doc1).to.have.property('id').that.is.equal(HERO1.id);
                        expect(doc1).to.have.property('firstName').that.is.equal(HERO1.firstName);
                        expect(doc1).to.have.property('lastName').that.is.equal(HERO1.lastName);
                        expect(doc2).to.have.property('id').that.is.equal(HERO2.id);
                        expect(doc2).to.have.property('firstName').that.is.equal(HERO2.firstName);
                        expect(doc2).to.have.property('lastName').that.is.equal(HERO2.lastName);
                        db[HEROES]._localForage.length(function (err, length) {
                            if (err) {
                                done(err);
                            } else {
                                expect(length).to.equal(2);
                                done();
                            }
                        });
                    })
                    .fail(done);
            });

            it('it should INSERT into collection 1 without id', function (done) {
                var db = new Database({ name: PONGO_DB, collections: [HEROES, MOVIES] });
                expect(db).to.be.an.instanceof(Database);
                expect(db).to.have.property(HEROES).that.is.an.instanceof(Collection);
                db[HEROES].insert(HERO3)
                    .done(function (doc3) {
                        expect(doc3).to.have.property('id').that.is.equal(HERO3.id);
                        expect(doc3).to.have.property('firstName').that.is.equal(HERO3.firstName);
                        expect(doc3).to.have.property('lastName').that.is.equal(HERO3.lastName);
                        HERO3 = doc3;
                        db[HEROES]._localForage.length(function (err, length) {
                            if (err) {
                                done(err);
                            } else {
                                expect(length).to.equal(3);
                                done();
                            }
                        });
                    })
                    .fail(done);
            });

            it('it should ** not ** INSERT into collection 1 an existing id', function (done) {
                var db = new Database({ name: PONGO_DB, collections: [HEROES, MOVIES] });
                expect(db).to.be.an.instanceof(Database);
                expect(db).to.have.property(HEROES).that.is.an.instanceof(Collection);
                db[HEROES].insert(HERO3)
                    .done(function () {
                        done(new Error('Inserting a duplicate id should fail'));
                    })
                    .fail(function (xhr, status, error) {
                        done();
                    });
            });

            it('it should INSERT into collection 2', function (done) {
                var db = new Database({ name: PONGO_DB, collections: [HEROES, MOVIES] });
                expect(db).to.be.an.instanceof(Database);
                expect(db).to.have.property(MOVIES).that.is.an.instanceof(Collection);
                MOVIE1 = $.extend(MOVIE1, { id: (new ObjectId()).toString() });
                MOVIE2 = $.extend(MOVIE2, { id: (new ObjectId()).toString() });
                MOVIE3 = $.extend(MOVIE3, { id: (new ObjectId()).toString() });
                $.when(
                    db[MOVIES].insert(MOVIE1),
                    db[MOVIES].insert(MOVIE2),
                    db[MOVIES].insert(MOVIE3)
                )
                    .done(function (doc1, doc2, doc3) {
                        expect(doc1).to.have.property('id').that.is.equal(MOVIE1.id);
                        expect(doc1).to.have.property('title').that.is.equal(MOVIE1.title);
                        expect(doc1).to.have.property('year').that.is.equal(MOVIE1.year);
                        expect(doc2).to.have.property('id').that.is.equal(MOVIE2.id);
                        expect(doc2).to.have.property('title').that.is.equal(MOVIE2.title);
                        expect(doc2).to.have.property('year').that.is.equal(MOVIE2.year);
                        expect(doc3).to.have.property('id').that.is.equal(MOVIE3.id);
                        expect(doc3).to.have.property('title').that.is.equal(MOVIE3.title);
                        expect(doc3).to.have.property('year').that.is.equal(MOVIE3.year);
                        db[MOVIES]._localForage.length(function (err, length) {
                            if (err) {
                                done(err);
                            } else {
                                expect(length).to.equal(3);
                                done();
                            }
                        });
                    })
                    .fail(done);
            });

            it('it should FIND documents based on id in collection 1', function (done) {
                var db = new Database({ name: PONGO_DB, collections: [HEROES, MOVIES] });
                expect(db).to.be.an.instanceof(Database);
                expect(db).to.have.property(HEROES).that.is.an.instanceof(Collection);
                db[HEROES].find({ id: HERO2.id })
                    .progress(function (status) {
                        // There is actually no progress notified with an ObjectId
                        // expect(status.index).to.be.a('number').gte(0).and.lt(status.total);
                        throw new Error('Progress should not have been called');
                    })
                    .done(function (docs) {
                        expect(docs).to.be.an.instanceof(Array).with.property('length', 1);
                        expect(docs[0]).to.have.property('id').that.is.equal(HERO2.id);
                        expect(docs[0]).to.have.property('firstName').that.is.equal(HERO2.firstName);
                        expect(docs[0]).to.have.property('lastName').that.is.equal(HERO2.lastName);
                        done();
                    })
                    .fail(done);
            });

            it('it should ** not ** FIND documents based on unknown id in collection 1', function (done) {
                var db = new Database({ name: PONGO_DB, collections: [HEROES, MOVIES] });
                expect(db).to.be.an.instanceof(Database);
                expect(db).to.have.property(HEROES).that.is.an.instanceof(Collection);
                db[HEROES].find({ id: (new ObjectId()).toString() })
                    .progress(function (status) {
                        // There is actually no progress notified with an ObjectId
                        // expect(status.index).to.be.a('number').gte(0).and.lt(status.total);
                        throw new Error('Progress should not have been called');
                    })
                    .done(function (docs) {
                        expect(docs).to.be.an.instanceof(Array).with.property('length', 0);
                        done();
                    })
                    .fail(done);
            });

            it('it should FIND documents based on complex queries in collection 2', function (done) {
                var db = new Database({ name: PONGO_DB, collections: [HEROES, MOVIES] });
                expect(db).to.be.an.instanceof(Database);
                expect(db).to.have.property(MOVIES).that.is.an.instanceof(Collection);
                db[MOVIES].find({ year: { $lte: 2012 } })
                    .progress(function (status) {
                        expect(status.index).to.be.a('number').gte(0).and.lt(status.total);
                    })
                    .done(function (docs) {
                        expect(docs).to.be.an.instanceof(Array).with.property('length', 2);
                        // Note: we cannot predict the order which depends on random ObjectId
                        var doc1;
                        var doc3;
                        if (docs[0].id === MOVIE1.id) {
                            doc1 = docs[0];
                            doc3 = docs[1];
                        } else {
                            doc1 = docs[1];
                            doc3 = docs[0];
                        }
                        expect(doc1).to.have.property('id').that.is.equal(MOVIE1.id);
                        expect(doc1).to.have.property('title').that.is.equal(MOVIE1.title);
                        expect(doc1).to.have.property('year').that.is.equal(MOVIE1.year);
                        expect(doc3).to.have.property('id').that.is.equal(MOVIE3.id);
                        expect(doc3).to.have.property('title').that.is.equal(MOVIE3.title);
                        expect(doc3).to.have.property('year').that.is.equal(MOVIE3.year);
                        done();
                    })
                    .fail(done);
            });

            it('it should COUNT documents based on id in collection 1', function (done) {
                var db = new Database({ name: PONGO_DB, collections: [HEROES, MOVIES] });
                expect(db).to.be.an.instanceof(Database);
                expect(db).to.have.property(HEROES).that.is.an.instanceof(Collection);
                db[HEROES].count({ id: HERO2.id })
                    .progress(function (status) {
                        // There is actually no progress notified with an ObjectId
                        // expect(status.index).to.be.a('number').gte(0).and.lt(status.total);
                        throw new Error('Progress should not have been called');
                    })
                    .done(function (count) {
                        expect(count).to.equal(1);
                        done();
                    })
                    .fail(done);
            });

            it('it should COUNT documents based on complex queries in collection 2', function (done) {
                var db = new Database({ name: PONGO_DB, collections: [HEROES, MOVIES] });
                expect(db).to.be.an.instanceof(Database);
                expect(db).to.have.property(MOVIES).that.is.an.instanceof(Collection);
                db[MOVIES].count({ year: { $lte: 2012 } })
                    .progress(function (status) {
                        expect(status.index).to.be.a('number').gte(0).and.lt(status.total);
                    })
                    .done(function (count) {
                        expect(count).to.equal(2);
                        done();
                    })
                    .fail(done);
            });

            it('it should UPDATE documents based on id in collection 1', function (done) {
                var db = new Database({ name: PONGO_DB, collections: [HEROES, MOVIES] });
                expect(db).to.be.an.instanceof(Database);
                expect(db).to.have.property(HEROES).that.is.an.instanceof(Collection);
                db[HEROES].update({ id: HERO2.id }, { mask: false, cape: true })
                    .progress(function (status) {
                        // There is actually no progress notified with an ObjectId
                        // expect(status.index).to.be.a('number').gte(0).and.lt(status.total);
                        throw new Error('Progress should not have been called');
                    })
                    .done(function (writeResult) {
                        expect(writeResult).to.have.property('nMatched').that.is.equal(1);
                        expect(writeResult).to.have.property('nUpserted').that.is.equal(0);
                        expect(writeResult).to.have.property('nModified').that.is.equal(1);
                        done();
                    })
                    .fail(done);
            });

            it('it should ** not ** UPDATE documents based on unknown id in collection 1', function (done) {
                var db = new Database({ name: PONGO_DB, collections: [HEROES, MOVIES] });
                expect(db).to.be.an.instanceof(Database);
                expect(db).to.have.property(HEROES).that.is.an.instanceof(Collection);
                db[HEROES].update({ id: (new ObjectId()).toString() }, { mask: false, cape: true })
                    .progress(function (status) {
                        // There is actually no progress notified with an ObjectId
                        // expect(status.index).to.be.a('number').gte(0).and.lt(status.total);
                        throw new Error('Progress should not have been called');
                    })
                    .done(function (writeResult) {
                        expect(writeResult).to.have.property('nMatched').that.is.equal(0);
                        expect(writeResult).to.have.property('nUpserted').that.is.equal(0);
                        expect(writeResult).to.have.property('nModified').that.is.equal(0);
                        done();
                    })
                    .fail(done);
            });

            it('it should UPDATE documents based on complex queries in collection 2', function (done) {
                var db = new Database({ name: PONGO_DB, collections: [HEROES, MOVIES] });
                expect(db).to.be.an.instanceof(Database);
                expect(db).to.have.property(MOVIES).that.is.an.instanceof(Collection);
                db[MOVIES].update({ title: { $regex: /^Man/ } }, { producer: 'DC Comics' })
                    .progress(function (status) {
                        expect(status.index).to.be.a('number').gte(0).and.lt(status.total);
                    })
                    .done(function (writeResult) {
                        expect(writeResult).to.have.property('nMatched').that.is.equal(3);
                        expect(writeResult).to.have.property('nUpserted').that.is.equal(0);
                        expect(writeResult).to.have.property('nModified').that.is.equal(1);
                        done();
                    })
                    .fail(done);
            });

            it('it should REMOVE documents based on id from collection 1', function (done) {
                var db = new Database({ name: PONGO_DB, collections: [HEROES, MOVIES] });
                expect(db).to.be.an.instanceof(Database);
                expect(db).to.have.property(HEROES).that.is.an.instanceof(Collection);
                db[HEROES].remove({ id: HERO3.id })
                    .progress(function (status) {
                        // There is actually no progress notified with an ObjectId
                        // expect(status.index).to.be.a('number').gte(0).and.lt(status.total);
                        throw new Error('Progress should not have been called');
                    })
                    .done(function (writeResult) {
                        expect(writeResult).to.have.property('nRemoved').that.is.equal(1);
                        db[HEROES]._localForage.length(function (err, length) {
                            if (err) {
                                done(err);
                            } else {
                                expect(length).to.equal(2);
                                done();
                            }
                        });
                    })
                    .fail(done);
            });

            it('it should ** not ** REMOVE documents based on unknown id from collection 1', function (done) {
                var db = new Database({ name: PONGO_DB, collections: [HEROES, MOVIES] });
                expect(db).to.be.an.instanceof(Database);
                expect(db).to.have.property(HEROES).that.is.an.instanceof(Collection);
                db[HEROES].remove({ id: (new ObjectId()).toString() })
                    .progress(function (status) {
                        // There is actually no progress notified with an ObjectId
                        // expect(status.index).to.be.a('number').gte(0).and.lt(status.total);
                        throw new Error('Progress should not have been called');
                    })
                    .done(function (writeResult) {
                        expect(writeResult).to.have.property('nRemoved').that.is.equal(0);
                        db[HEROES]._localForage.length(function (err, length) {
                            if (err) {
                                done(err);
                            } else {
                                expect(length).to.equal(2);
                                done();
                            }
                        });
                    })
                    .fail(done);
            });

            it('it should REMOVE documents based on complex query from collection 2', function (done) {
                var db = new Database({ name: PONGO_DB, collections: [HEROES, MOVIES] });
                expect(db).to.be.an.instanceof(Database);
                expect(db).to.have.property(MOVIES).that.is.an.instanceof(Collection);
                db[MOVIES].remove({ producer: 'DC Comics' })
                    .progress(function (status) {
                        expect(status.index).to.be.a('number').gte(0).and.lt(status.total);
                    })
                    .done(function (writeResult) {
                        expect(writeResult).to.have.property('nRemoved').that.is.equal(1);
                        db[MOVIES]._localForage.length(function (err, length) {
                            if (err) {
                                done(err);
                            } else {
                                expect(length).to.equal(2);
                                done();
                            }
                        });
                    })
                    .fail(done);
            });

            it('it should CLEAR collection 1', function (done) {
                var db = new Database({ name: PONGO_DB, collections: [HEROES, MOVIES] });
                expect(db).to.be.an.instanceof(Database);
                expect(db).to.have.property(HEROES).that.is.an.instanceof(Collection);
                db[HEROES].clear()
                    .done(function () {
                        db[HEROES]._localForage.length(function (err, length) {
                            if (err) {
                                done(err);
                            } else {
                                expect(length).to.equal(0);
                                done();
                            }
                        });
                    })
                    .fail(done);
            });

            it('it should CLEAR collection 2', function (done) {
                var db = new Database({ name: PONGO_DB, collections: [HEROES, MOVIES] });
                expect(db).to.be.an.instanceof(Database);
                expect(db).to.have.property(MOVIES).that.is.an.instanceof(Collection);
                db[MOVIES].clear()
                    .done(function () {
                        db[MOVIES]._localForage.length(function (err, length) {
                            if (err) {
                                done(err);
                            } else {
                                expect(length).to.equal(0);
                                done();
                            }
                        });
                    })
                    .fail(done);
            });

        });

        describe('Triggers', function () {
            // TODO
        });

        describe('Upgraded and Migrations', function () {
            // TODO
        });

        describe('Drop Collections and Databases', function () {
            // TODO
        });

    });


}(window.jQuery));
