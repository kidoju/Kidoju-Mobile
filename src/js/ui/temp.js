/**
 * Event handler for the viewModel change event
 */
viewModel.bind(CHANGE, function (e) {
    assert.isNonEmptyPlainObject(e, assert.format(assert.messages.isOptionalObject.default, 'e'));
    assert.type(STRING, e.field, assert.format(assert.messages.type.default, 'e.field', STRING));
    assert.instanceof(kendo.Observable, e.sender, assert.format(assert.messages.instanceof.default, 'e.sender', 'kendo.Observable'));
    switch (e.field) {
        case VIEW_MODEL.SELECTED_PAGE:
            var view = mobile.application.view();
            if (view.id === HASH + VIEW.CORRECTION) {
                // Reset NavBar buttons and title
                mobile._setNavBar(view);
                mobile._setNavBarTitle(view, kendo.format(i18n.culture.correction.viewTitle, viewModel.page$(), viewModel.totalPages$()));
                if (viewModel.isLastPage$() && !view.element.prop(kendo.attr('showScoreInfo'))) {
                    // Let's remember that we have already displayed this notification for this test
                    view.element.prop(kendo.attr('showScoreInfo'), true);
                    app.notification.info(i18n.culture.notifications.showScoreInfo);
                }
            } else if (view.id === HASH + VIEW.PLAYER) {
                // Reset NavBar buttons and title
                mobile._setNavBar(view);
                mobile._setNavBarTitle(view, kendo.format(i18n.culture.player.viewTitle, viewModel.page$(), viewModel.totalPages$()));
                if (viewModel.isLastPage$() && !view.element.prop(kendo.attr('clickSubmitInfo'))) {
                    // Let's remember that we have already displayed this notification for this test
                    view.element.prop(kendo.attr('clickSubmitInfo'), true);
                    app.notification.info(i18n.culture.notifications.clickSubmitInfo);
                }
            }
            break;
        case VIEW_MODEL.USER.$:
            viewModel.reset();
            break;
        case VIEW_MODEL.USER.ROOT_CATEGORY_ID:
            viewModel.syncUsers();
            // .done(function () {
            //     viewModel.reset();
            // });
            break;
        case VIEW_MODEL.LANGUAGE:
            // Do not trigger before the kendo mobile application is loaded
            if (mobile.application instanceof kendo.mobile.Application && $.isPlainObject(i18n.culture)) {
                var language = e.sender.get(VIEW_MODEL.LANGUAGE);
                i18n.load(language)
                .done(function () {
                    mobile.localize(language);
                    // Reset categories
                    viewModel.set(VIEW_MODEL.CATEGORIES, new models.LazyCategoryDataSource()); // This is necessary because it loads for __.locale
                    // Reset the root category
                    // Note this triggers a change that executes `case VIEW_MODEL.USER.ROOT_CATEGORY_ID` here above
                    viewModel.set(VIEW_MODEL.USER.ROOT_CATEGORY_ID, DEFAULT.ROOT_CATEGORY_ID[language]);
                    logger.debug({
                        method: 'viewModel.bind',
                        message: 'Language changed to ' + language
                    });
                });
            }
            break;
        case VIEW_MODEL.THEME:
            // Do not trigger before the kendo mobile application is loaded
            if (mobile.application instanceof kendo.mobile.Application) {
                var theme = e.sender.get(VIEW_MODEL.THEME);
                // app.theme.load stores the theme in localStorage
                app.theme.load(theme).done(function () {
                    mobile.application.skin(theme);
                    mobile._fixThemeVariant(theme);
                    logger.debug({
                        method: 'viewModel.bind',
                        message: 'Theme changed to ' + theme
                    });
                });
            }
            break;
    }
});
