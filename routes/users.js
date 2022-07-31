const router = require('express').Router();

const {
  updateUserValid,
  updateAvatarUserValid,
  userIdValid,
} = require('../middlewares/validation');

const {
  getUsers,
  getUser,
  updateUser,
  getCurrentUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', userIdValid, getUser);
router.patch('/me', updateUserValid, updateUser);
router.patch('/me/avatar', updateAvatarUserValid, updateAvatar);

module.exports = router;
