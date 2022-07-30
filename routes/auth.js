const router = require('express').Router();
const { createUser, loginUser } = require("../controllers/users");
const {
  registerValid,
  loginValid,
} = require('../middlewares/validation');

router.post('/signup', registerValid, createUser);
router.post('/signin', loginValid, loginUser);

module.exports = router;
