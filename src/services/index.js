const meal = require('./meal/meal.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(meal);
};
