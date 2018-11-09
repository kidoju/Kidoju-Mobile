


/**
 * Lazy version data source (especially for drop down list)
 * @type {*|void}
 */
models.LazyVersionDataSource = DataSource.extend({

    /**
     * Init
     * @constructor
     * @param options
     */
    init: function (options) {
        DataSource.fn.init.call(this, $.extend(true, { pageSize: 100 }, options, {
            transport: new models.LazyVersionTransport({
                partition: options && options.partition
            }),
            serverFiltering: true,
            serverSorting: true,
            // pageSize: 100,
            serverPaging: true,
            schema: {
                data: 'data',
                total: 'total',
                errors: 'error',
                modelBase: models.LazyVersion,
                model: models.LazyVersion,
                parse: function (response) {
                    // Name versions: draft, version 1, version 2, ....
                    if (response && $.type(response.total === NUMBER && $.isArray(response.data))) {
                        $.each(response.data, function (index, version) {
                            if (version.state === VERSION_STATE.DRAFT) {
                                version.name = i18n.culture.versions.draft.name;
                            } else {
                                version.name = format(i18n.culture.versions.published.name, response.data.length - index);
                            }
                        });
                    }
                    return response;
                }
            }
        }));
    },

    /**
     * Sets the partition and queries the data source
     * @param options
     */
    load: function (options) {
        if (options && $.isPlainObject(options.partition)) {
            this.transport.partition(options.partition);
        }
        return this.query(options);
    }

});
