// TODO can probably be removed

/**
 * Version reference for activities
 * @type {kidoju.data.Model}
 */
models.VersionReference = Model.define({
    id: 'versionId', // the identifier of the model, which is required for isNew() to work
    fields: {
        language: {
            type: CONSTANTS.STRING,
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
        versionId: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true
        }
    }
});
