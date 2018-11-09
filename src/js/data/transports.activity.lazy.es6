

/**
 * LazyActivityTransport transport
 */
models.LazyActivityTransport = BaseTransport.extend({

    /**
     * Read transport
     * @param options
     */
    read: function (options) {

        var partition = this.partition();

        logger.debug({
            message: 'dataSource.read',
            method: 'app.models.LazyActivityDataSource.transport.read',
            data: { partition: partition }
        });

        if ($.type(partition) === UNDEFINED) {

            // Makes it possible to create the data source without partition
            options.success({ total: 0, data: [] });

        } else if (RX_MONGODB_ID.test(partition.summaryId)) { // If we have a summaryId for the content being displayed, we fetch summary activities

            options.data.fields = 'actor,date,score,type,version';
            options.data.sort = options.data.sort || [{ field: 'date', dir: 'desc' }];

            // TODO should be rapi.v1.summary.read
            rapi.v1.content.findSummaryActivities(partition['version.language'], partition['version.summaryId'], options.data)
            .then(function (response) {
                options.success(response);
            })
            .catch(function (xhr, status, error) {
                options.error(xhr, status, error);
            });

        } else { // Without a summaryId, we need an authenticated user to fetch user activities

            // options.data.fields = 'actor,date,score,type,version'; <-- actor is always the same
            options.data.fields = 'date,score,type,version';
            options.data.sort = options.data.sort || [{ field: 'date', dir: 'desc' }];

            rapi.v1.user.findMyActivities(partition.language, options.data)
            .then(function (response) {
                options.success(response);
            })
            .catch(function (xhr, status, error) {
                options.error(xhr, status, error);
            });
        }
    }

});
