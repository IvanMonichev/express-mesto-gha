const mongoose = require('mongoose');
const {
  isEmail,
  isStrongPassword,
} = require('validator');

const userScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'содержит меньше 2-ух символов'],
      maxlength: [30, 'содержит больше 30 символов'],
      default: 'Жив-Ив Кусто',
    },
    about: {
      type: String,
      minlength: [2, 'содержит меньше 2-ух символов'],
      maxlength: [30, 'содержит больше 30 символов'],
      default: 'Исследователь океана',
    },
    avatar: {
      type: String,
      required: true,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => {
          isEmail(email);
        },
        message: 'Формат записи поля E-Mail некорректен',
      },
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
