const router = require('express').Router();

const {
  createCardValid,
  cardIdValid,
} = require('../middlewares/validation');

const {
  createCard,
  deleteCard,
  getCards,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.post('/', createCardValid, createCard);
router.delete('/:cardId', cardIdValid, deleteCard);
router.get('/', getCards);
router.put('/:cardId/likes', cardIdValid, likeCard);
router.delete('/:cardId/likes', cardIdValid, dislikeCard);

module.exports = router;
