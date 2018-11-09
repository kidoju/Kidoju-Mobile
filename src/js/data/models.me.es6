

/**
 * CurrentUser model
 * Minimal non-editable user to display in the navbar
 *
 * @type {kidoju.data.Model}
 */
models.CurrentUser = Model.define({
    id: CONSTANTS.ID, // the identifier of the model, which is required for isNew() to work
    fields: {
        id: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true
        },
        firstName: {
            type: CONSTANTS.STRING,
            editable: false
        },
        lastName: {
            type: CONSTANTS.STRING,
            editable: false
        },
        picture: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true
        }
        // timezone (for display of dates), born (for searches)
    },
    fullName$: function () {
        return ((this.get('firstName') || '').trim() + ' ' + (this.get('lastName') || '').trim()).trim();
    },
    picture$: function () {
        return this.get('picture') || format(uris.cdn.icons, 'user');
    },
    isAuthenticated$: function () {
        return RX_MONGODB_ID.test(this.get('id'));
    },
    userUri$: function () {
        return format(uris.webapp.user, i18n.locale(), this.get('id'));
    },
    reset: function () {
        // Since we have marked fields as non editable, we cannot use 'that.set'
        this.accept({
            id: this.defaults.id,
            firstName: this.defaults.firstName,
            lastName: this.defaults.lastName,
            picture: this.defaults.picture
        });
    },
    load: function () {
        var that = this;
        return app.cache.getMe()
        .then(function (data) {
            if ($.isPlainObject(data) && RX_MONGODB_ID.test(data.id)) {
                // Since we have marked fields as non editable, we cannot use 'that.set',
                // This should raise a change event on the parent viewModel
                that.accept({
                    id: data.id,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    picture: data.picture
                });
            } else {
                that.reset();
            }
        });
    }
});
