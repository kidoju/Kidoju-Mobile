/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

// https://github.com/benmosher/eslint-plugin-import/issues/1097
// eslint-disable-next-line import/extensions, import/no-unresolved
import $ from 'jquery';
import 'kendo.data';
import CONSTANTS from '../common/window.constants.es6';
import BaseModel from './data.base.es6';

const { } = window.kendo;

/**
 * Search model
 * Note: Search is more about content than taxonomy, but saving a search adds to rummages
 * @type {kidoju.data.Model}
 */
const Search = BaseModel.define({
    id: 'userId', // the identifier of the model, which is required for isNew() to work
    fields: {
        userId: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true
        },
        ageGroup: {
            type: CONSTANTS.NUMBER,
            defaultValue: 255
        },
        author: {
            type: CONSTANTS.STRING
        },
        categoryId: {
            type: CONSTANTS.STRING
        },
        favourite: { // name of favourite when saveChecked
            type: CONSTANTS.STRING
        },
        navbar: { // text search in navbar
            type: CONSTANTS.STRING
        },
        saveChecked: {
            type: CONSTANTS.BOOLEAN,
            defaultValue: false
        },
        sort: {
            type: CONSTANTS.STRING,
            defaultValue: 'd' // other possible values are 'r' and 'v' for dates, rates and views
        },
        text: { // text search
            type: CONSTANTS.STRING
        }
    },

    /**
     * Contructor
     * @param data
     */
    init: function (data) {
        var that = this;
        Model.fn.init.call(that, data);
        this.bind(CHANGE, $.proxy(that._onChange, that));
    },

    /**
     * Whether there is enough data to save a favourite
     * @returns {boolean}
     */
    isSavable$: function () {
        return RX_MONGODB_ID.test(this.get('userId')) &&
            (this.get('age') !== this.defaults.age || this.get('author') !== this.defaults.author || this.get('category') !== this.defaults.category || this.get('text') !== this.defaults.text);
    },

    /**
     * Event handler for the change event
     * @param e
     * @private
     */
    _onChange: function (e) {
        if (e.field === 'saveChecked' && !this.get('saveChecked')) {
            this.set('favourite', this.defaults.favourite);
        } else if (!this.isSavable$() && this.get('saveChecked')) {
            this.set('saveChecked', this.defaults.saveChecked);
        }
    },

    /* This function's cyclomatic complexity is too high. */
    /* jshint -W074 */

    /**
     * get the hash
     * the hashchange event handler will actually trigger the search so that searches can be bookmarked as favourites
     * @param advanced
     * @returns {string}
     */
    getHash: function (advanced) {
        if (advanced) { // build hash from search panel
            var options = {
                filter: {
                    logic : 'and',
                    filters: []
                },
                sort: []
            };

            // Filter
            var ageGroup = this.get('ageGroup');
            if ($.type(ageGroup) === NUMBER && ageGroup > 0 && ageGroup < 255) {
                options.filter.filters.push({ field: 'ageGroup', operator: 'flags', value: ageGroup });
            }
            var author = this.get('author');
            if ($.type(author) === STRING && author.trim().length) {
                options.filter.filters.push({ field: 'author.lastName', operator: 'startswith', value: author.trim() });
            }
            var categoryId = this.get('categoryId');
            if (RX_MONGODB_ID.test(categoryId)) {
                options.filter.filters.push({ field: 'categoryId', operator: 'eq', value: categoryId });
            }
            var text = this.get('text');
            if ($.type(text) === STRING && text.trim().length) {
                options.filter.filters.push({ field: '$text', operator: 'eq', value: text.trim() });
                // Note: the language is added server side based on the url, so do not bother here
            }

            var length = options.filter.filters.length;

            if (length === 0) {
                return HASHBANG; // '';
            } else if (length === 1) {
                options.filter = options.filter.filters[0];
            }

            // Sort
            var sort = this.get('sort');
            switch (sort) {
                case 'd': // sort by dates
                    options.sort = [{ field: 'updated', dir: 'desc' }];
                    break;
                case 'r': // sort by ratings
                    options.sort = [{ field: 'metrics.ratings.average', dir: 'desc' }];
                    break;
                case 'v': // sort by number of views
                    options.sort = [{ field: 'metrics.views.count', dir: 'desc' }];
                    break;
            }

            // Return hash
            return HASHBANG + $.param(options);

        } else { // build hash from navbar

            var navbar = this.get('navbar').trim();

            // Return hash - this is a different format that can be used for sitelink search snippet
            // https://developers.google.com/webmasters/richsnippets/sitelinkssearch
            return HASHBANG + (navbar ? 'q=' + encodeURIComponent(navbar) : '');

        }
    },

    /* jshint +W074 */

    /**
     * Load search
     * @returns {*}
     */
    load: function () {
        var that = this;
        return app.cache.getMe()
        .then(function (me) {
            // TODO in order to set a default age, we would need the date of birth
            if ($.isPlainObject(me) && RX_MONGODB_ID.test(me.id)) {
                // Since we have marked fields as non editable, we cannot use 'that.set',
                // This should raise a change event on the parent viewModel
                that.accept({ userId: me.id });
            } else {
                that.accept({ userId: null });
            }
        });
    },

    /**
     * Reset search
     */
    reset: function () {
        this.set('ageGroup', this.defaults.ageGroup);
        this.set('author', this.defaults.author);
        this.set('categoryId', this.defaults.categoryId);
        this.set('favourite', this.defaults.favourite);
        this.set('navbar', this.defaults.navbar);
        this.set('saveChecked', this.defaults.saveChecked);
        this.set('sort', this.defaults.sort);
        this.set('text', this.defaults.text);
    },

    /**
     * Save search as favourite
     * @returns {*}
     */
    save: function () {
        // We need a userId to save a search as a user favourite
        assert.match(RX_MONGODB_ID, this.userId, assert.format(assert.messages.match.default, 'this.userId', RX_MONGODB_ID));
        var root = window.location.protocol + '//' + window.location.host;
        var finder = format(uris.webapp.finder, i18n.locale());
        finder = finder.indexOf(root) === 0 ? finder.substr(root.length) : finder;
        var favourite = {
            name: this.get('favourite').trim(),
            path: finder + this.getHash(true)
        };
        // TODO: we should rather update the cache
        app.cache.removeMyFavourites(i18n.locale());
        // Save a favourite on the current user
        return rapi.v1.user.createMyFavourite(i18n.locale(), favourite);
    }
});

/**
 * Default export
 */
export default Search;
