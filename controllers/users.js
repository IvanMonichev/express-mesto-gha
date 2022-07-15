const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then(users => res.status(200).send(users))
    .catch(err => res.status(500).send({ message: err.message }));
}

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then(user => {
      if (!user) {
        res.status(404).send({ message: "Такого пользователя не существует!" })
        return;
      }
      res.status(200).send(user);
    })
    .catch(err => res.status(500).send({ message: err.message }));
}

const createUser = (req, res) => {

  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.status(201).send(user))
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(422).send({ message: err.name });
        return;
      }

      res.status(500).send({ message: err.message })
    })
}

const updateUser = (req, res) => {

  const id = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(id, { name, about })
    .then(({ name, about }) => {
      res.status(200).send({
        _id: id,
        name: name,
        about: about
      })
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(422).send({ message: err.name });
        return;
      }
      res.status(500).send({ message: err.message })
    })
}

const updateAvatar = (req, res) => {

}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser
}
