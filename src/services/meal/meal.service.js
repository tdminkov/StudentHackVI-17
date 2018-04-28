// Initializes the `meal` service on path `/meal`
const createService = require('./meal.class.js');
const hooks = require('./meal.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'meal',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/meal', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('meal');

  service.hooks(hooks);
};
