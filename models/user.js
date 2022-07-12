const mongoose = require('mongoose');

const userScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 2,
      maxLength: 30,
      required: true,
    },
    about: {
      type: String,
      minLength: 2,
      maxLength: 30,
      required: true,
    },
    avatar: {
      type: String,
      reuired: true
    }
  }
)

module.exports = mongoose.model('user', userScheme);