var apiRoutePath = '/' + API_CONFIG.api_version + '/articles';

module.exports = (app) => {
  app.use(apiRoutePath, require('./route'));
};
