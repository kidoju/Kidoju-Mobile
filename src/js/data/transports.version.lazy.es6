


/**
 * LazyVersionTransport transport
 */
models.LazyVersionTransport = BaseTransport.extend({

    /**
     * Read transport
     * @param options
     */
    read: function (options) {

        assert.isPlainObject(options, assert.format(assert.messages.isPlainObject.default, 'options'));
        assert.isPlainObject(options.data, assert.format(assert.messages.isPlainObject.default, 'options.data'));
        // assert.type(STRING, options.data.summaryId, assert.format(assert.messages.type.default, 'options.data.summaryId', STRING));
        // assert.equal(this.summaryId, options.data.summaryId, assert.format(assert.messages.equal.default, options.data.summaryId, this.summaryId ));

        var partition = this.partition();

        logger.debug({
            message: 'dataSource.read',
            method: 'app.models.LazyVersionDataSource.transport.read',
            data: { partition: partition }
        });

        if ($.type(partition) === UNDEFINED) {

            // Makes it possible to create the data source without partition
            options.success({ total: 0, data: [] });

        } else {

            options.data.fields = 'state,summaryId';
            options.data.sort = [{ field: 'id', dir: 'desc' }];

            rapi.v1.content.findSummaryVersions(partition.language, partition.summaryId, options.data)
            .then(function (response) {
                options.success(response);
            })
            .catch(function (xhr, error, status) {
                options.error(xhr, error, status);
            });
        }
    },

    /**
     * Destroy transport
     * @param options
     */
    destroy: function (options) {

        assert.isPlainObject(options, assert.format(assert.messages.isPlainObject.default, 'options'));
        assert.isPlainObject(options.data, assert.format(assert.messages.isPlainObject.default, 'options.data'));
        // TODO: review considering partition (use this._validation)
        assert.type(STRING, options.data.id, assert.format(assert.messages.type.default, 'options.data.id', STRING));
        assert.type(STRING, options.data.summaryId, assert.format(assert.messages.type.default, 'options.data.summaryId', STRING));
        // assert.equal(this.summaryId, options.data.summaryId, assert.format(assert.messages.equal.default, options.data.summaryId, this.summaryId));

        var partition = this.partition();

        logger.debug({
            message: 'dataSource.destroy',
            method: 'app.models.LazyVersionDataSource.transport.destroy',
            data: { partition: partition, versionId: options.data.id }
        });

        // TODO In order to support a generic transport we should have rapi.v1.version.destroy(options) where options extends partition with options.data.id
        rapi.v1.content.deleteSummaryVersion(partition.language, partition.summaryId, options.data.id)
        .then(function (response) {
            options.success(response);
        })
        .catch(function (xhr, error, status) {
            options.error(xhr, error, status);
        });
    }

});
