/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

import viewModel from '../app/app.viewmodel.es6';
// import activities from './viewmodel.activities.es6';
import categories from './viewmodel.categories.es6';
import settings from './viewmodel.settings.es6';
// import stage from './viewmodel.stage.es6';
// import summaries from './viewmodel.summaries.es6';
import users from './viewmodel.users.es6';
// import versions from './viewmodel.versions.es6';

/**
 * Extend viewModel
 */
// viewModel.extend(activities);
viewModel.extend(categories);
viewModel.extend(settings);
// viewModel.extend(stage);
// viewModel.extend(summaries);
viewModel.extend(users);
// viewModel.extend(versions);

/**
 * Reset viewModel (creates all properties)
 */
viewModel.reset();

/**
 * Default export
 */
export default viewModel;
