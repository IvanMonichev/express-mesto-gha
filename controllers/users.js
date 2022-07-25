const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { getJwtToken } = require('../utils/jwt');
const {ERROR_CODE, DEFAULT_ERROR, NOT_FOUND} = require('../errors/statusCode');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      res.status(DEFAULT_ERROR).send({message: 'Ошибка сервера'});
    });
};

const getUser = (req, res) => {
  const {userId} = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({
          message: 'Такого пользователя не существует',
        });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({message: 'Пользователь по указанному ID не найден'});
        return;
      }
      res.status(DEFAULT_ERROR).send({message: 'Ошибка сервера'});
    });
};

const updateUser = (req, res) => {
  const owner = req.user._id;
  const {name, about} = req.body;

  User.findByIdAndUpdate(owner, {name, about}, {runValidators: true})
    .then((user) => {
      res.send({
        _id: owner,
        name,
        about,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({message: err.message});
      } else if (err.name === 'CastError') {
        res.status(NOT_FOUND).send({message: 'Пользователь с указанным ID не найден'});
      } else {
        res.status(DEFAULT_ERROR).send({message: 'Ошибка сервера'});
      }
    });
};

const updateAvatar = (req, res) => {
  const owner = req.user._id;
  const {avatar} = req.body;

  User.findByIdAndUpdate(owner, {avatar}, {runValidators: true})
    .then((user) => {
      res.send({
        _id: owner,
        user: user.name,
        about: user.about,
        avatar,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({message: 'Переданы некорректные данные при обновлении профиля'});
      } else if (err.name === 'CastError') {
        res.status(NOT_FOUND).send({message: 'Пользователь с указанным ID не найден'});
      } else {
        res.status(DEFAULT_ERROR).send({message: 'Ошибка сервера'});
      }
    });
};

const createUser = (req, res) => {
  const {name, about, avatar, email, password} = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({name, about, avatar, email, password: hash})
        .then((user) => res.status(201).send(user))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            res.status(ERROR_CODE).send({message: 'Переданы некорректные данные при создании пользователя'});
            return;
          }
          res.status(DEFAULT_ERROR).send({message: 'Ошибка сервера'});
        });
    })

};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ 'message': 'Email или пароль не переданы' });
  }

  User.findOne({ email })
    .then((user) => {
      if(!user) {
        return res.status(403).send({ "message": "Такого пользователя не существует" });
      }

      bcrypt.compare(password, user.password, (err, isValidPassword) => {
        if (!isValidPassword) {
          return res.status(401).send({ 'message': 'Email или пароль неверный' });
        }

        // Создаём JWT-токен со сроком на одну неделю.
        const token = getJwtToken(user._id);
        res.cookie('jwt', token, {
          maxAge: 1000 * 60 * 60 * 24 * 7, /* [миллисекунды * секунды * минуты * часы * дни = 7 дней ] */
          httpOnly: true,
        });
        return res.status(200).send({ 'message': 'Аутентификация выполнена', 'token': token });
      })
    })
    .catch(() => {
      res.status(401).send({message: 'Ошибка аутентификации'});
    });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  loginUser,
};
