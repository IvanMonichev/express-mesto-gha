const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { getJwtToken } = require('../utils/jwt');
const NotFoundError = require('../errors/not-found-error');
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
        next(new NotFoundError('Такого пользователя не существует'));
      }
      response.send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Пользователь по указанному ID не найден'));
      } else {
        next(error);
      }
    });
};

const updateUser = (request, response, next) => {
  const owner = request.user.id;
  const {
    name,
    about
  } = request.body;

  User.findByIdAndUpdate(owner, {
    name,
    about
  }, { runValidators: true })
    .then((user) => {
      response.send({
        _id: owner,
        name,
        about,
        avatar: user.avatar,
      });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError(error.message));
      } else if (error.name === 'CastError') {
        next(new NotFoundError('Пользователь с указанным ID не найден'))
      } else {
        next(error);
      }
    });
};

const updateAvatar = (request, response, next) => {
  const owner = request.user._id;
  const { avatar } = request.body;

  User.findByIdAndUpdate(owner, { avatar }, { runValidators: true })
    .then((user) => {
      response.send({
        _id: owner,
        user: user.name,
        about: user.about,
        avatar,
      });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      } else if (error.name === 'CastError') {
        next(new NotFoundError('Пользователь с указанным ID не найден'))
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
    password
  } = request.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash
      })
        .then((user) => response.status(201)
          .send(user))
        .catch((error) => {
          if (error.name === 'ValidationError') {
            next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
          } else {
            next(error);
          }
        });
    });

};

const getCurrentUser = (request, response, next) => {
  const owner = request.user.id;

  User.findById(owner)
    .then((user) => {
      response.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      } else if (error.name === 'CastError') {
        next(new NotFoundError('Пользователь с указанным ID не найден'))
      } else {
        next(error);
      }
    });
};

const loginUser = (request, response, next) => {
  const {
    email,
    password
  } = request.body;

  if (!email || !password) {
    return response.status(400)
      .send({ 'message': 'Email или пароль не переданы' });
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return response.status(403)
          .send({ 'message': 'Такого пользователя не существует' });
      }

      bcrypt.compare(password, user.password, (error, isValidPassword) => {
        if (!isValidPassword) {
          return response.status(401)
            .send({ 'message': 'Email или пароль неверный' });
        }

        // Создаём JWT-токен со сроком на одну неделю.
        const token = getJwtToken(user._id);
        response.cookie('jwt', token, {
          maxAge: 1000 * 60 * 60 * 24 * 7, /* [миллисекунды * секунды * минуты * часы * дни = 7 дней ] */
          httpOnly: true,
        });
        return response.status(200)
          .send({
            'message': 'Аутентификация выполнена',
            'token': token
          });
      });
    })
    .catch(() => {
      response.status(401)
        .send({ message: 'Ошибка аутентификации' });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  loginUser,
  getCurrentUser
};
