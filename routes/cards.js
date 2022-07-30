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
} = require('../middlewares/validation');

router.post('/', createCardValid, createCard);
router.delete('/:cardId', deleteCard);
router.get('/', getCards);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
