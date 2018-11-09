/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import assert from '../common/window.assert.es6';
import { localCache } from '../common/window.cache.es6';
import CONSTANTS from '../common/window.constants.es6';
import Logger from '../common/window.logger.es6';

const logger = new Logger('rapi.oauth');
const { app, localStorage } = window;
const TOKEN = 'token';
const ACCESS_TOKEN = 'access_token';
