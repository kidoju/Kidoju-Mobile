
/**
 * Activity model
 * @type {kidoju.data.Model}
 */
models.LazyActivity = Model.define({
    id: CONSTANTS.ID, // the identifier of the model, which is required for isNew() to work
    fields: {
        id: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true
        },
        /*
        scheme: {
            type: CONSTANTS.STRING,
            editable: false,
            defaultValue: (app.constants && app.constants.appScheme) ? app.constants.appScheme : 'com.kidoju.default' // undefined
        },
        categoryId: {
            type: CONSTANTS.STRING,
            editable: false
        },
        created: {
            type: CONSTANTS.DATE,
            editable: false
        },
        */
        date: {
            type: CONSTANTS.DATE,
            editable: false,
            defaultValue: function () { return new Date(); }
        },
        firstName: {
            type: CONSTANTS.STRING,
            editable: false
        },
        language: {
            type: CONSTANTS.STRING,
            editable: false
        },
        lastName: {
            type: CONSTANTS.STRING,
            editable: false
        },
        /*text: {
         type: CONSTANTS.STRING,
         nullable: true,
         editable: false
         },*/
        type: {
            type: CONSTANTS.STRING,
            editable: false
        },
        /*
        updated: {
            type: CONSTANTS.DATE,
            editable: false
        },
        */
        score: {
            type: CONSTANTS.NUMBER,
            nullable: true,
            editable: false
        },
        summaryId: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true
        },
        title: {
            type: CONSTANTS.STRING,
            editable: false
        },
        userId: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true
        },
        versionId: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true
        }/*,
                 value: {
                 type: CONSTANTS.NUMBER,
                 nullable: true,
                 editable: false
                 }*/
    },
    actorName$: function () {
        return ((this.get('firstName') || '').trim() + ' ' + (this.get('lastName') || '').trim()).trim();
    },
    actorUri$: function () {
        return format(uris.webapp.user, this.get('language'), this.get('userId'));
    },
    scoreUri$: function () {
        return format(uris.webapp.player, this.get('language'), this.get('summaryId'), this.get('versionId')) +
            format('#/report/{0}', this.get('id')); // TODO: add to config files
    },
    summaryUri$: function () {
        // Some activities like `creation` may refer to unpublished summaries and we do not know whether the summary is published or not
        // Therefore, we should always bypass server-side data requests to display such summaries
        // This is not an issue regarding SEO because activities are only displayed to authenticated user
        return format(uris.webapp.summary, this.get('language'), this.get('summaryId'));
    }
});

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
