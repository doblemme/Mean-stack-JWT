const {Schema, model} = require('mongoose');

const userSchema = new Schema({ nombre: String, paterno: String, materno: String, email: String, password: String},
  {
    timestamps: true
   });

module.exports = model('user', userSchema);
