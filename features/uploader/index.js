var api_route_path = '/' + api_config.api_version + '/uploader';

module.exports = (app) => {
  app.use(api_route_path, require('./route'));
};
