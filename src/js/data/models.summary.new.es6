
/**
 * New summary model
 * This model is essentially used by the create window in header.ejs
 * @type {kidoju.data.Model}
 */
models.NewSummary = Model.define({
    id: CONSTANTS.ID, // the identifier of the model, which is required for isNew() to work
    fields: {
        id: {
            type: CONSTANTS.STRING,
            editable: false,
            nullable: true
        },
        author: {
            defaultValue: {},
            parse(value) {
                return value instanceof models.UserReference ? value : new models.UserReference(value);
            }
        },
        categoryId: {
            type: CONSTANTS.STRING,
            nullable: true
        },
        language: {
            type: CONSTANTS.STRING,
            defaultValue: i18n.locale(),
            editable: false,
            validation: {
                required: true
            }
        },
        title: {
            type: CONSTANTS.STRING,
            validation: {
                required: true,
                pattern: '^\\S[^<>]{4,48}\\S$'
            }
        }/*,
                 type: {
                 type: CONSTANTS.STRING,
                 validation: {
                 required: true
                 }
                 }*/
    },
    language$: function () {
        var locale = this.get('language');
        var languages = i18n.culture.languages;
        for (var i = 0; i < languages.length; i++) {
            if (languages[i].value === locale) {
                return languages[i].name;
            }
        }
        return null ;
    },
    load: function () {
        var that = this;
        return app.cache.getMe()
        .then(function (me) {
            if ($.isPlainObject(me) && RX_MONGODB_ID.test(me.id)) {
                me.userId = me.id;
                // delete me.picture;
                that.set('author', new models.UserReference(me));
                // that.set('language', i18n.locale());
            }
        });
    },
    reset: function () {
        var that = this;
        that.set('categoryId', this.defaults.category);
        that.set('title', this.defaults.title);
        // that.set('type', this.defaults.type);
    },
    save: function () {
        var that = this;
        // We could also have used toJSON and deleted any useless data
        var newSummary = {
            author: {
                userId: that.get('author.userId')
                // Let the server feed the authenticated user firstName and lastName from author.userId
            },
            categoryId: that.get('categoryId'), // sets the icon and age group
            language: that.get('language'),
            title: that.get('title'),
            type: that.get('type.value')
        };
        // Call server to create a new summary and return a promise
        return rapi.v1.content.createSummary(i18n.locale(), newSummary);
    }
});
