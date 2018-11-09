

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
