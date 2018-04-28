// Initializes the `finishedQueue` service on path `/finished-queue`
const createService = require('./finished-queue.class.js');
const hooks = require('./finished-queue.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'finished-queue',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/finished-queue', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('finished-queue');

  service.hooks(hooks);
};
