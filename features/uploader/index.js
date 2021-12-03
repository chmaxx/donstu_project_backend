var apiRoutePath = '/' + API_CONFIG.api_version + '/uploader';

module.exports = (app) => {
  app.use(apiRoutePath, require('./route'));
};
