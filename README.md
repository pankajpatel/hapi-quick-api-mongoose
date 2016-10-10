# hapi-quick-api-mongoose

---------------------------

This package will simply convert passed schema configs to APIs in HapiJS with the help of [get-it-ready](http://npmjs.com/package/get-it-ready).

The Schema Config should look like this:

```javascript
//Person.js
var Mongoose = require('mongoose'),
    Schema = Mongoose.Schema;
var Joi = require('joi');

let schema =  {
  firstName: { type: String, required: true, joi: Joi.string() },
  lastName: { type: String, required: true, joi: Joi.string() },
  photo: { type: String, required: false, joi: Joi.string() },
  createdOn: { type: Date, required: false, default: Date.now, joi: Joi.date() }
}

export default {
  definition: schema,
  name: 'Person',
  version: '0.1.0'
}
````

And in the HapiJS server can be simply coded in following way:

```javascript
//index.js
//THIS FILE WILL BE BABEL TRANSPILED
import Hapi from 'hapi';
import Inert from 'inert';
import Vision from 'vision';
import Mongoose from 'mongoose';
const HapiSwagger =  require('hapi-swagger');

import person from './Person';

const hapiQuickApiMongoose = require('hapi-quick-api-mongoose');

var config = {
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 8000
  }
};

// Create a server with a host and port
const server = new Hapi.Server();
server.connection(config.server);

//Connect and create placeholders
server.app.models = {};

server.app.db = Mongoose.createConnection(uri);
server.app.db.on('error', console.error.bind(console, 'connection error'));
server.app.db.once('open', function callback() {
    console.log("Connection with database succeeded.");
});

//Register the plugins/modules
server.register([
  Inert,
  Vision,
  {
    'register': HapiSwagger,
    'options': {
      info: {
        title: 'API Documentation',
        version: 0.1.0,
      }
    }
  },
  {
    register: hapiQuickApiMongoose,
    options: {
      connection: server.app.db,
      models: [person]
    }
  }], err => {
    console.log(err)
  }
);

// Start the server
server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});
```

Now head over to browser on url http://localhost:8000/documentation and see the magic.
