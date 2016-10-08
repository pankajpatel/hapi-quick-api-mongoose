var getItReady = require('get-it-ready');

var Plugin = {};
Plugin.register = function(server, options, next) {
  options.models.map(function(model, index){
    var plugin = {};
    var ingredients = getItReady(model.definition, model.name.toLowerCase() + 's', model.name , model.name.toLowerCase());
    plugin.register = function(server, options, next) {
      server.route( ingredients.routes );
      server.app.models[model.name] = ingredients.model;
      next();
    };
    plugin.register.attributes = {
      name : model.name + 'Module',
      version : model.version
    }
    server.register({register: plugin});
  })
};

Plugin.register.attributes = {
  name : 'hapi-quick-api-mongoose',
  version : '0.1.0'
};
module.exports = Plugin;
