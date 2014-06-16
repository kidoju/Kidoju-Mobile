/**
 * Copyright (c) 2013-2014 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba/Kidoju-Platform
 */

/* jslint browser: true */
/* jshint browser: true */

'use strict';

var testData= {

    content1: {
        id: '_000000000000000000000001',
        version: 1,
        title: 'My first kidoju',
        description: 'A long description of a kidoju',
        author: 'Joe Bloggs',
        language: 'en',
        categories: ['Mathematics', 'Algebra'],
        tags: ['Boole'],
        rating: 3.45,
        views: 10345,
        createdOn: new Date(2014, 2, 14),
        publishedOn: new Date(2014, 3, 15)
        //TODO: Do we need a user_id to allow several people to log on a tablet? a portfolio_id?
    },

    content2: {
        id: '_000000000000000000000002',
        version: 2,
        title: 'My second kidoju',
        description: 'A long description of a kidoju',
        author: 'Joe Bloggs',
        language: 'en',
        categories: ['Mathematics', 'Geometry'],
        tags: ['Pythagore'],
        rating: 3.7,
        views: 6824,
        createdOn: new Date(2014, 2, 14),
        publishedOn: new Date(2014, 3, 15)
    },

    activity1: {
        id: '_00000000000000000000000A',
        type: 'Comment', //__t
        content_id: '_000000000000000000000001',
        user_id: 'joebloggs', //--> retrieve the user id
        text: 'This is a simple comment'
    },

    activity2: {
        id: '_00000000000000000000000B',
        type: 'Rating',
        content_id: '_000000000000000000000002',
        user_id: 'joebloggs',
        value: 4
    }
}