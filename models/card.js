const mongoose = require('mongoose');

const cardScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Свойство {PATH} содержит меньше 2-ух символов'],
      maxlength: [30, 'Свойство {PATH} содержит больше 30 символов'],
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: [],
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('card', cardScheme);
