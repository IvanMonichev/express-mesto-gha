const mongoose = require('mongoose');

const userScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'содержит меньше 2-ух символов'],
      maxlength: [30, 'содержит больше 30 символов'],
      required: true,
    },
    about: {
      type: String,
      minlength: [2, 'содержит меньше 2-ух символов'],
      maxlength: [30, 'содержит больше 30 символов'],
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('user', userScheme);
