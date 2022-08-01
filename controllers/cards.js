const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');

const getCards = (request, response, next) => {
  Card.find({})
    .then((cards) => response.send(cards))
    .catch(next);
};

const createCard = (request, response, next) => {
  const {
    name,
    link,
  } = request.body;
  const owner = request.user.id;
  Card.create({
    name,
    link,
    owner,
  })
    .then((card) => response.status(201)
      .send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные при создании карточки'));
      } else {
        next(error);
      }
    });
};

const deleteCard = (request, response, next) => {
  const owner = request.user.id;
  const { cardId } = request.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Переданы некорректные данные для удаления карточки');
      } else if (owner.toString() !== card.owner.toString()) {
        throw new ForbiddenError(`Пользователь с ID ${owner} не является владельцем данной карточки`);
      } else {
        Card.findByIdAndRemove(cardId)
          .then(() => {
            response.send({ message: `Карточка с ID ${card.id} удалена` });
          })
          .catch(next);
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Карточка с указанным ID не найдена'));
      }
      next(error);
    });
};

const likeCard = (request, response, next) => {
  const owner = request.user.id;
  const { cardId } = request.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: owner } },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Переданы некорректные данные для постановки лайк');
      } else {
        response.send(card);
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Передан несуществующий ID карточки'));
      } else if (error.name === 'ValidationError') {
        next(new BadRequestError(error.message));
      } else {
        next(error);
      }
    });
};

const dislikeCard = (request, response, next) => {
  const owner = request.user.id;
  const { cardId } = request.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: owner } },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Переданы некорректные данные для постановки лайк');
      } else {
        response.send(card);
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Передан несуществующий ID карточки'));
      } else if (error.name === 'ValidationError') {
        next(new BadRequestError(error.message));
      } else {
        next(error);
      }
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
