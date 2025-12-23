const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/privatekeymanagement');

const keySchema = new mongoose.Schema({
  username: String,
  password: String,
  privateKey: String,
  publicKey: String
})

const users = mongoose.model('users', keySchema);

module.exports = { users };
