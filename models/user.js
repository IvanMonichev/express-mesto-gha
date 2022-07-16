const mongoose = require('mongoose');

const userScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Свойство {PATH} содержит меньше 2-ух символов'],
      maxlength: [30, 'Свойство {PATH} содержит больше 30 символов'],
      required: true,
    },
    about: {
      type: String,
      minlength: [2, 'Свойство {PATH} содержит меньше 2-ух символов'],
      maxlength: [30, 'Свойство {PATH} содержит больше 30 символов'],
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
