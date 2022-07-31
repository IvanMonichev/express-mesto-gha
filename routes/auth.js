const router = require('express').Router();
const {
  registerValid,
  loginValid,
} = require('../middlewares/validation');
const { createUser, loginUser } = require('../controllers/users');

router.post('/signup', registerValid, createUser);
router.post('/signin', loginValid, loginUser);

module.exports = router;
