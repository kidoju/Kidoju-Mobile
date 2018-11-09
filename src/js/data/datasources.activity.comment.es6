

/**
 * Datasource of comments
 * @type {kendo.Observable}
 */
models.CommentDataSource = DataSource.extend({

    /**
     * Init
     * @constructor
     * @param options
     */
    init: function (options) {
        var that = this;
        that.userId = options && options.userId; // the authenticated user
        that.summaryId = options && options.summaryId;

        DataSource.fn.init.call(that, $.extend(true, {}, {
            transport: {
                create: $.proxy(that._transport._create, that),
                destroy: $.proxy(that._transport._destroy, that),
                read: $.proxy(that._transport._read, that),
                update: $.proxy(that._transport._update, that)
            },
            serverFiltering: true,
            serverSorting: true,
            pageSize: 5,
            serverPaging: true,
            schema: {
                data: function (response) {
                    // See: http://www.telerik.com/forums/transport-methods-and-ids-created-on-the-server
                    if (response && $.type(response.total) === NUMBER && $.isArray(response.data)) { // read list
                        return response.data;
                    } else { // create, update, delete
                        return response;
                    }
                },
                total: 'total',
                errors: 'error',
                modelBase: models.Comment,
                model: models.Comment,
                parse: function (response) {
                    // add userId of authenticated user
                    if (response) {
                        if ($.type(response.total) === NUMBER && $.isArray(response.data)) { // a read
                            $.each(response.data, function (index, comment) {
                                comment.userId = that.userId;
                            });
                        } else { // a create or update
                            response.userId = that.userId;
                        }
                    }
                    return response;
                }
            }
        }, options));
    },
    load: function (options) {
        var that = this;
        that.summaryId = options && options.summaryId;
        that.userId = options && options.userId;
        return that.query(options);
    },
    /*
     * Setting _transport._read here with a reference above is a trick
     * so as to be able to replace this function in mockup scenarios
     */
    _transport: {
        _create: function (options) {
            var that = this;
            rapi.v1.content.createSummaryActivity(
                (options.data.version && options.data.version.language) || i18n.locale(),
                (options.data.version && options.data.version.summaryId) || that.summaryId,
                { type: 'comment', text: options.data.text }
            )
            .then(function (response) {
                options.success(response);
            })
            .catch(function (xhr, status, error) {
                options.error(xhr, status, error);
            });
        },
        _destroy: function (options) {
            var that = this;
            rapi.v1.content.deleteSummaryActivity(
                options.data.version.language,
                options.data.version.summaryId,
                options.data.id
            )
            .then(function (response) {
                options.success(response);
            })
            .catch(function (xhr, status, error) {
                options.error(xhr, status, error);
            });
        },
        _read: function (options) {
            var that = this;
            // We cannot fetch activities without a summary Id
            assert.match(RX_MONGODB_ID, that.summaryId, assert.format(assert.messages.match.default, 'this.summaryId', RX_MONGODB_ID));
            options.data.fields = 'actor,date,text,version';
            options.data.filter = { field: 'type', operator: 'eq', value: 'Comment' };
            options.data.sort = [{ field: 'id', dir: 'desc' }];
            rapi.v1.content.findSummaryActivities(
                i18n.locale(),
                that.summaryId,
                options.data
            )
            .then(function (response) {
                options.success(response);
            })
            .catch(function (xhr, status, error) {
                options.error(xhr, status, error);
            });
        },
        _update: function (options) {
            rapi.v1.content.updateSummaryActivity(
                options.data.version.language,
                options.data.version.summaryId,
                options.data.id,
                { text: options.data.text }
            )
            .then(function (response) {
                options.success(response);
            })
            .catch(function (xhr, status, error) {
                options.error(xhr, status, error);
            });
        }
    }
});
