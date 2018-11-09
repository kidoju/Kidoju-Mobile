

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
