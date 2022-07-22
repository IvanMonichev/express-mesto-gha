const mongoose = require('mongoose');
const validator = require('validator');

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
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => {
          validator.isEmail(email);
        },
        message: 'Формат записи поля E-Mail некорректен',
      },
    },
    password: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (password) => {
          validator.isStrongPassword(password, {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 0
          })
        },
        message: "Формат записи поля Password некорректен. " +
          "Пароль должен состоять минимум из 6 символов, " +
          "1 символа нижнего регистра, " +
          "1 символа верхнего регистра и содержать минимум 1 число",
      },
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('user', userScheme);