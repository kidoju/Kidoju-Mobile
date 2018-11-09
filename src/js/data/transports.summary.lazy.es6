


/**
 * LazySummaryTransport transport
 */
models.LazySummaryTransport = BaseTransport.extend({

    /**
     * Read transport
     * @param options
     */
    read: function (options) {
        var partition = this.partition();

        // TODO: Partition by type (quiz, flashcards, ...) !!!!

        logger.debug({
            message: 'dataSource.read',
            method: 'app.models.LazySummaryDataSource.transport.read',
            data: { partition: partition }
        });

        // add options.data.filter.filters.push({ field: 'language', operator: 'eq', value: i18n.locale() });
        // ATTENTION logic and or or

        // TODO: Find fields in Model
        options.data.fields = 'author,icon,metrics.comments.count,language,metrics.ratings.average,metrics.scores.average,metrics.views.count,published,tags,title,type,updated';
        options.data.sort = options.data.sort || [{ field: 'updated', dir: 'desc' }];

        if ($.type(partition) === UNDEFINED) {

            // Makes it possible to create the data source without partition
            options.success({ total: 0, data: [] });

        } else if (!RX_MONGODB_ID.test(partition['author.userId'])) {

            // Without user id, we just query public summaries
            rapi.v1.content.findSummaries(partition.language, options.data)
            .then(function (response) {
                options.success(response);
            })
            .catch(function (xhr, status, error) {
                options.error(xhr, status, error);
            });

        } else {

            // With a userId, we request all summaries the author of which has such userId
            app.cache.getMe()
            .then(function (me) {

                if ($.isPlainObject(me) && partition['author.userId'] === me.id) {

                    // If we request the summaries of the authenticated user, include drafts
                    rapi.v1.user.findMySummaries(partition.language, options.data)
                    .then(function (response) {
                        options.success(response);
                    })
                    .catch(function (xhr, status, error) {
                        options.error(xhr, status, error);
                    });

                } else {

                    // If we request the summaries of an author who is not the (authenticated/anonymous) user, only fetch public/published summaries
                    var filter = {
                        logic: 'and',
                        filters: [
                            { field: 'author.userId', operator: 'eq', value: partition['author.userId'] }
                        ]
                    };
                    if ($.isPlainObject(options.data.filter)) {
                        if (options.data.filter.logic === 'and' && Array.isArray(options.data.filter.filters)) {
                            Array.prototype.push.apply(filter.filters, options.data.filter.filters);
                        } else if (options.data.filter.logic === 'or' && Array.isArray(options.data.filter.filters)) {
                            filter.filters.push(options.data.filter);
                        } else if ($.type(options.data.filter.field) === STRING && $.type(options.data.filter.operator) === STRING) {
                            Array.prototype.push.apply(filter.filters, options.data.filter);
                        }
                    }
                    options.data.filter = filter;

                    rapi.v1.content.findSummaries(partition.language, options.data)
                    .then(function (response) {
                        options.success(response);
                    })
                    .catch(function (xhr, status, error) {
                        options.error(xhr, status, error);
                    });
                }

            })
            .catch(function (xhr, status, error) {
                options.error(xhr, status, error);
            });
        }
    }

});
