


/**
 * Lazy version
 * @type {kidoju.data.Model}
 */
models.LazyVersion = Model.define({
    id: CONSTANTS.ID, // the identifier of the model, which is required for isNew() to work
    fields: {
        id: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true
        },
        // created
        // language
        name: {
            type: CONSTANTS.STRING,
            editable: false
        },
        state: {
            type: CONSTANTS.NUMBER,
            editable: false
        },
        // stream
        summaryId: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true
        }
        // type
        // updated
        // userId
    },
    versionPlayUri$: function () {
        return format(uris.webapp.player, i18n.locale(), this.get('summaryId'), this.get('id'), '').slice(0, -1);
    },
    versionEditUri$: function () {
        return format(uris.webapp.editor, i18n.locale(), this.get('summaryId'), this.get('id'));
    },
    iframe$: function () {
        // TODO consider the sandbox attribute -- see http://www.html5rocks.com/en/tutorials/security/sandboxed-iframes/
        return format(
            '<iframe src="{0}?embed=true{1}" style="height:500px;width:100%;border:solid 1px #d5d5d5;"></iframe>',
            this.versionPlayUri$(),
            app && app.theme && $.isFunction(app.theme.name) ? '&theme=' + encodeURIComponent(app.theme.name()) : ''
        );
    }
});

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
