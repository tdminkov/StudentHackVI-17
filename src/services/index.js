const getQueueNumber = require('./get-queue-number/get-queue-number.service.js');
const finishedQueue = require('./finished-queue/finished-queue.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(getQueueNumber);
  app.configure(finishedQueue);
};
