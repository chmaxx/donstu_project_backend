var apiRoutePath = '/' + API_CONFIG.api_version + '/backup';

module.exports = (app) => {
  app.use(apiRoutePath, require('./route'));
};
