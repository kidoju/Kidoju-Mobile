/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* eslint-disable no-unused-expressions */

import chai from 'chai';
import plugin from '../../../src/js/plugins/plugins.splashscreen.es6';

const { expect } = chai;
const { describe, it } = window;

describe('plugins.splashscreen', () => {
    it('ready', () => {
        expect(plugin.ready()).to.be.true;
    });

    it('hide', () => {

    });

    it('show', () => {

    });
});
