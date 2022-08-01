const router = require('express').Router();
const authRouter = require('./auth');
const userRouter = require('./users');
const cardRouter = require('./cards');
const { checkAuthorization } = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-error');

router.use('/', authRouter);
router.use(checkAuthorization);
router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((request, response, next) => {
  next(new NotFoundError('Путь не найден'));
});

module.exports = router;
