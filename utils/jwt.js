const jwt = require('jsonwebtoken');
const User = require('../models/user');


const JWT_SECRET = 'temporary-secret-key';

const getJwtToken = (id) => {
  return jwt.sign({id}, JWT_SECRET, {expiresIn: '7d'});
}

const isAuthorised = (token) => {
  let payload;

}

module.exports = {
  getJwtToken,
  isAuthorised,
}
