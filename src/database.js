var config = require('./config');
const mongoose = require('mongoose');

mongoose.connect(config.uri+config.db, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
  if (err){
    console.log('Existe el siguiente error al conectarse a la base: ', err);
  }else {
    console.log('Conexión establecida por medio de mongoose a schema: ', config.db);
  }
});
