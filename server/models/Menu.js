const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  url: String,
  price: Number,
  section: Number,
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = { Menu };
