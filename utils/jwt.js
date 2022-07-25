const jwt = require('jsonwebtoken');

const JWT_SECRET = 'temporary-secret-key';

const getJwtToken = (id) => {
  return jwt.sign({id}, JWT_SECRET, {expiresIn: '7d'});
}

const isAuthorised = (token) => {

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return false;
    }

    User.findById(decoded.id);
  })
}

module.exports = {
  getJwtToken,
  isAuthorised
}
