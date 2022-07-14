const router = require('express').Router();
const { createCard, deleteCard, getCard } = require('../controllers/cards');

router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCard);
router.get('/cards', getCard);

module.exports = router;
