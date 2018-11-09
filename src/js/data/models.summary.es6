



/**
 * Summary model
 * @type {kidoju.data.Model}
 */
models.Summary = Model.define({
    id: CONSTANTS.ID, // the identifier of the model, which is required for isNew() to work
    fields: {
        id: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true,
            serializable: false
        },
        ageGroup: {
            type: CONSTANTS.NUMBER,
            defaultValue: 255
        },
        author: {
            // For complex types, the recommendation is to leave the type undefined and set a default value
            // See: http://www.telerik.com/forums/model---complex-model-with-nested-objects-or-list-of-objects
            // See: http://demos.telerik.com/kendo-ui/grid/editing-custom
            defaultValue: null,
            editable: false,
            serializable: false,
            parse(value) {
                return (value instanceof models.UserReference || value === null) ? value : new models.UserReference(value);
            }
        },
        categoryId: {
            type: CONSTANTS.STRING
        },
        created: {
            type: CONSTANTS.DATE,
            editable: false,
            serializable: false
        },
        description: {
            type: CONSTANTS.STRING
        },
        icon: {
            type: CONSTANTS.STRING,
            defaultValue: 'spacer'
        },
        language: {
            type: CONSTANTS.STRING,
            editable: false,
            serializable: false
        },
        metrics: {
            defaultValue: {},
            editable: false,
            serializable: false,
            parse(value) {
                return value instanceof models.SummaryMetricsReference ? value : new models.SummaryMetricsReference(value);
            }
        },
        published: {
            type: CONSTANTS.DATE,
            editable: false,
            nullable: true,
            serializable: false
        },
        tags: {
            defaultValue: []
        },
        title: {
            type: CONSTANTS.STRING
        },
        type: {
            type: CONSTANTS.STRING,
            editable: false,
            serializable: false
        },
        updated: {
            type: CONSTANTS.DATE,
            editable: false,
            serializable: false
        },
        userScore: { // Used in Kidoju-Mobile only
            from: 'activities',
            type: CONSTANTS.NUMBER,
            editable: false,
            nullable: true,
            serializable: false,
            parse: function (activities) {
                // We need a userId but `this` is undefined, so we cannot find it in this object or in its parents
                // so we are assigning app._userId in app.mobile.viewModel._reset but this is really crap
                if (Array.isArray(activities) && RX_MONGODB_ID.test(app._userId)) {
                    for (var i = 0, length = activities.length; i < length; i++) {
                        if (activities[i].actorId === app._userId) {
                            return activities[i].score;
                        }
                    }
                }
            }
        }
    },
    hasUserScore$: function () { // Used in Kidoju-Mobile only
        return $.type(this.get('userScore')) === NUMBER;
    },
    icon$: function () {
        return format(window.cordova ? uris.mobile.icons : uris.cdn.icons, this.get('icon'));
    },
    isError$: function () { // Used in Kidoju-Mobile only
        var userScore = this.get('userScore');
        // Note: we need to test the value type because comparing a null to a number is always true
        return ($.type(userScore) === NUMBER) && userScore < 50;
    },
    isSuccess$: function () { // Used in Kidoju-Mobile only
        var userScore = this.get('userScore');
        return ($.type(userScore) === NUMBER) && userScore >= 75;
    },
    isWarning$: function () { // Used in Kidoju-Mobile only
        var userScore = this.get('userScore');
        return ($.type(userScore) === NUMBER) && userScore >= 50 && userScore < 75;
    },
    summaryUri$: function () {
        return format(uris.webapp.summary, this.get('language'), this.get('id'));
    },
    tags$: function () {
        return this.get('tags').join(', ');
    },
    userScore$: function () { // Used in Kidoju-Mobile only
        return kendo.toString(this.get('userScore') / 100, 'p0');
    },
    init: function (data) {
        var that = this;
        Model.fn.init.call(that, data);
        that.bind(CHANGE, $.proxy(that._onChange, that));
    },
    _onChange: function (e) {
        // call the base function
        Model.fn._notifyChange.call(this, e);
        // kendo only handles add/remove on arrays of child elements
        // set dirty when an itemchange occurs in an array, e.g. versions
        // See: http://blog.falafel.com/Blogs/JoshEastburn/josh-eastburn/2014/04/25/dirty-children-and-kendo-ui
        if (e.action === ITEMCHANGE) {
            this.dirty = true;
        }
    },
    load: function (data) {
        var that = this;
        var dfd = $.Deferred();
        if (RX_MONGODB_ID.test(data)) {
            // data is a summary id and we fetch a full summary
            rapi.v1.content.getSummary(i18n.locale(), data)
            .then(function (summary) {
                that.accept(summary);
                dfd.resolve(summary);
            })
            .catch(dfd.reject);
        } else if ($.isPlainObject(data) && RX_MONGODB_ID.test(data.id)) {
            if (data.published instanceof Date) {
                // data is a published summary and we use model.accept to load data
                that.accept(data);
                dfd.resolve(data);
            } else {
                // data is a draft summary, hence it is incomplete
                // because the webapp could not fetch the summary without authentication
                // We therefore need to fetch a full summary
                // data is a summary id and we fetch a full summary
                rapi.v1.content.getSummary(i18n.locale(), data.id)
                .then(function (summary) {
                    that.accept(summary);
                    dfd.resolve(summary);
                })
                .catch(dfd.reject);
            }
        } else {
            var xhr = new ErrorXHR(400, 'Neither data nor data.id is a MongoDB ObjectId');
            // dfd.reject(xhr, status, error);
            dfd.reject(xhr, ERROR, xhr.statusText);
        }
        return dfd.promise();
    },
    save: function (fields) {
        var that = this;
        var dfd = $.Deferred();
        if (that.dirty) { // TODO Validate
            var data = filter(that.toJSON(), fields);
            assert.isPlainObject(data, assert.format(assert.messages.isPlainObject.default, 'data'));
            // Check that all model fields marked as serializable === false won't be sent
            assert.isUndefined(data.author, assert.format(assert.messages.isUndefined.default, 'data.author'));
            assert.isUndefined(data.created, assert.format(assert.messages.isUndefined.default, 'data.created'));
            assert.isUndefined(data.id, assert.format(assert.messages.isUndefined.default, 'data.id'));
            assert.isUndefined(data.language, assert.format(assert.messages.isUndefined.default, 'data.language'));
            assert.isUndefined(data.metrics, assert.format(assert.messages.isUndefined.default, 'data.metrics'));
            assert.isUndefined(data.type, assert.format(assert.messages.isUndefined.default, 'data.type'));
            assert.isUndefined(data.updated, assert.format(assert.messages.isUndefined.default, 'data.updated'));
            var language = that.get('language');
            var id = that.get('id');
            rapi.v1.content.updateSummary(language, id, data)
            .then(function (data) {
                // Note: data is not parsed, so dates are string
                that.accept(data); // this updates dirty and updated
                dfd.resolve(data);
            })
            .catch(function (xhr, status, error) {
                dfd.reject(xhr, status, error);
            });
        } else {
            setTimeout(function () {
                dfd.resolve(); // nothing to save
            }, 0);
        }
        return dfd.promise();
    },
    createDraft: function () {
        return rapi.v1.content.executeCommand(this.get('language'), this.get('id'), { command: 'draft' });
    },
    publish: function () {
        return rapi.v1.content.executeCommand(this.get('language'), this.get('id'), { command: 'publish' });
    },
    rate: function (value) {
        // TODO: what if already rated?????
        // TODO: check that an author cannot rate his own summaries
        return rapi.v1.content.createSummaryActivity(this.get('language'), this.get('id'), { type: 'rating', value: value });
    }
});
