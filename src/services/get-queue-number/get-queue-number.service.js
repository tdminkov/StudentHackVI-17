// Initializes the `getQueueNumber` service on path `/get-queue-number`
const createService = require('./get-queue-number.class.js');
const hooks = require('./get-queue-number.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'get-queue-number',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/get-queue-number', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('get-queue-number');

  service.hooks(hooks);
};
