const router = require('express').Router();
const { createUser, loginUser } = require("../controllers/users");
const { registerValid } = require('../middlewares/validation');

router.post('/signup', registerValid, createUser);
router.post('/signin', loginUser);

module.exports = router;
