const apiRoutePath = '/' + API_CONFIG.api_version + '/users';

module.exports = (app) => {
  app.use(apiRoutePath, require('./route'));
};
