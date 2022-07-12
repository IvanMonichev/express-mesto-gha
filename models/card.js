const mongoose = require('mongoose');

const cardScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 2,
      maxLength: 30,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: truel
    },
    avatar: {
      type: String,
      required: true,
    },
    likes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  }
)

module.exports = mongoose.model('card', cardScheme);