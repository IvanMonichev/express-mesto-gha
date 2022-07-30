const router = require('express').Router();

const {
  createCard,
  deleteCard,
  getCards,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const {
  createCardValid,
  cardIdValid,
} = require('../middlewares/validation');

router.post('/', createCardValid, createCard);
router.delete('/:cardId', deleteCard);
router.get('/', getCards);
router.put('/:cardId/likes', cardIdValid, likeCard);
router.delete('/:cardId/likes', cardIdValid, dislikeCard);

module.exports = router;
