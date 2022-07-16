const Card = require('../models/card');

const getCard = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => res.status(500).send({ message: err.message }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      res.status(200).send({ message: `Карточка с ID ${card.id} удалена` });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Карточка с указанным ID не найдена.' });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};

const likeCard = (req, res) => {
  const owner = req.user._id;

  Card.findOneAndUpdate(req.params.cardId, { $addToSet: { likes: owner } }, { new: true, runValidators: true })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Передан несуществующий ID карточки' });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

const dislikeCard = (req, res) => {
  const owner = req.user._id;

  Card.findOneAndUpdate(req.params.cardId, { $pull: { likes: owner } }, { new: true, runValidators: true, })
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Такой карточки не существует' });
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Передан несуществующий ID карточки' });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports = {
  createCard,
  getCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
