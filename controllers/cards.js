const Card = require('../models/card');
const { DEFAULT_ERROR, NOT_FOUND, ERROR_CODE } = require('../errors/statusCode');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(DEFAULT_ERROR).send({ message: 'Ошибка сервера' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: err.errors[Object.keys(err.errors)].message });
        return;
      }
      res.status(DEFAULT_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({
          message: 'Переданы некорректные данные для удаления карточки',
        });
      } else {
        res.send({ message: `Карточка с ID ${card.id} удалена` });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Карточка с указанным ID не найдена' });
        return;
      }
      res.status(DEFAULT_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const likeCard = (req, res) => {
  const owner = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: owner } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({
          message: 'Переданы некорректные данные для постановки лайк',
        });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Передан несуществующий ID карточки' });
      } else if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: err.errors[Object.keys(err.errors)].message });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

const dislikeCard = (req, res) => {
  const owner = req.user._id;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: owner } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({
          message: 'Переданы некорректные данные для постановки лайк',
        });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Передан несуществующий ID карточки' });
      } else if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: err.errors[Object.keys(err.errors)].message });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Ошибка сервера' });
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
