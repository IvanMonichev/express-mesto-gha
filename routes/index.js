const router = require('express').Router();
const authRouter = require('./auth');
const userRouter = require('./users');
const cardRouter = require('./cards');
const { checkAuthorization } = require('../middlewares/auth');

router.use('/users', authRouter);
router.use(checkAuthorization);
router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((req, res) => {
  res.status(404).send({ message: 'Путь не найден' });
});

module.exports = router;
