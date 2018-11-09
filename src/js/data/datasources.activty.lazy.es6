

/**
 * Datasource of user activities
 * @type {kendo.Observable}
 */
models.LazyActivityDataSource = DataSource.extend({

    /**
     * Init
     * @constructor
     * @param options
     */
    init: function (options) {
        DataSource.fn.init.call(this, $.extend(true, { pageSize: 5 }, options, {
            transport: new models.LazyActivityTransport({
                partition: options && options.partition
            }),
            serverFiltering: true,
            serverSorting: true,
            // pageSize: 5
            serverPaging: true,
            schema: {
                data: 'data',
                total: 'total',
                errors: 'error',
                modelBase: models.LazyActivity,
                model: models.LazyActivity,
                parse: function (response) {
                    // we parse the response to flatten data for our LazyActivity model (instead of using field.from and field.defaultValue definitions)
                    if (response && $.type(response.total === NUMBER && $.isArray(response.data))) {

                        /* This function's cyclomatic complexity is too high. */
                        /* jshint -W074 */

                        $.each(response.data, function (index, activity) {
                            // Flatten actor
                            activity.userId = activity.actor && activity.actor.userId || null;
                            activity.firstName = activity.actor && activity.actor.firstName || '';
                            activity.lastName = activity.actor && activity.actor.lastName || '';
                            if (activity.actor) {
                                activity.actor = undefined; // delete activity.actor;
                            }
                            // Flatten version
                            activity.language = activity.version && activity.version.language || i18n.locale();
                            activity.summaryId = activity.version && activity.version.summaryId || null;
                            activity.title = activity.version && activity.version.title || '';
                            activity.versionId = activity.version && activity.version.versionId || null;
                            if (activity.version) {
                                activity.version = undefined; // delete activity.version;
                            }
                        });

                        /* jshint +W074 */
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
