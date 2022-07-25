const router = require('express').Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  loginUser
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/signup', createUser);
router.post('/signin', loginUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
