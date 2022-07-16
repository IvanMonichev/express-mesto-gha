const User = require('../models/user');
const { ERROR_CODE, DEFAULT_ERROR, NOT_FOUND } = require('../errors/statusCode');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      res.status(DEFAULT_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

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
        res.status(ERROR_CODE).send({ message: 'Пользователь по указанному ID не найден' });
        return;
      }
      res.status(DEFAULT_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданы неккоректные данные при создании пользователя' });
        return;
      }
      res.status(DEFAULT_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const updateUser = (req, res) => {
  const owner = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(owner, { name, about }, { runValidators: true })
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
        res.status(ERROR_CODE).send({ message: err.errors[Object.keys(err.errors)].message });
      } else if (err.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным ID не найден' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

const updateAvatar = (req, res) => {
  const owner = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(owner, { avatar }, { runValidators: true })
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
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else if (err.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным ID не найден' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
