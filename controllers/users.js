const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { getJwtToken } = require('../utils/jwt');
const NotFoundError = require('../errors/not-found-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const ConflictError = require('../errors/conflict-error');
const BadRequestError = require('../errors/bad-request-error');

const getUsers = (request, response, next) => {
  User.find({})
    .then((users) => response.send(users))
    .catch(next);
};

const getUser = (request, response, next) => {
  const { userId } = request.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по заданному ID отсутствует в базе');
      }
      response.send(user);
    })
    .catch(next);
};

const updateUser = (request, response, next) => {
  const owner = request.user.id;
  const {
    name,
    about,
  } = request.body;

  User.findByIdAndUpdate(owner, {
    name,
    about,
  }, { runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по заданному ID отсутствует в базе');
      }
      response.send({
        _id: owner,
        name,
        about,
        avatar: user.avatar,
      });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные при обновление данных профиля'));
      } else {
        next(error);
      }
    });
};

const createUser = (request, response, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = request.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then(() => response.status(201)
          .send({
            name,
            about,
            avatar,
            email,
          }))
        .catch((error) => {
          if (error.code === 11000) {
            next(new ConflictError('Пользователь с таким E-Mail уже существует'));
          } else if (error.name === 'ValidationError') {
            next(new BadRequestError('Некорректные данные при создании пользователя'));
          } else {
            next(error);
          }
        });
    })
    .catch(next);
};

const updateAvatar = (request, response, next) => {
  const owner = request.user.id;
  const { avatar } = request.body;

  User.findByIdAndUpdate(owner, { avatar }, { runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по заданному ID отсутствует в базе');
      }
      response.send({
        _id: owner,
        user: user.name,
        about: user.about,
        avatar,
      });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные при обновление аватара профиля'));
      } else {
        next(error);
      }
    });
};

const getCurrentUser = (request, response, next) => {
  const owner = request.user.id;

  User.findById(owner)
    .then((user) => {
      response.send(user);
    })
    .catch(next);
};

const loginUser = (request, response, next) => {
  const {
    email,
    password,
  } = request.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Такого пользователя не существует');
      }

      return bcrypt.compare(password, user.password)
        .then((isValidPassword) => {
          if (!isValidPassword) {
            throw new UnauthorizedError('Неверный E-Mail или пароль');
          }
          const token = getJwtToken(user._id);
          response.cookie('jwt', token, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
          });

          return response.send({
            message: 'Аутентификация успешно выполнена',
            token,
          });
        });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  loginUser,
  getCurrentUser,
};
