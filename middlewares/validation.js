const { celebrate, Joi } = require('celebrate');
const { linkRegularExpression, passwordRegularExpression } = require('../utils/regulars')

const registerValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(6),
    about: Joi.string().min(2).max(6),
    avatar: Joi.string().regex(linkRegularExpression),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6).regex(passwordRegularExpression),
  })
})

const loginValid = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6).regex(passwordRegularExpression),
  })
})

const updateUserValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(6),
    about: Joi.string().min(2).max(6),
  })
})

const updateAvatarUserValid = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(linkRegularExpression)
  })
})

const createCardValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(6),
    link: Joi.string().regex(linkRegularExpression)
  })
})

module.exports = {
  registerValid,
  loginValid,
  updateUserValid,
  updateAvatarUserValid,
  createCardValid,
}
