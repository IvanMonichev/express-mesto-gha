const mongoose = require('mongoose');

const userScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'содержит меньше 2-ух символов'],
      maxlength: [30, 'содержит больше 30 символов'],
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: [2, 'содержит меньше 2-ух символов'],
      maxlength: [30, 'содержит больше 30 символов'],
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('user', userScheme);
