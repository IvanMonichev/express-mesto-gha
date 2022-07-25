const jwt = require('jsonwebtoken');

const JWT_SECRET = 'temporary-secret-key';

const getJwtToken = (id) => {
  return jwt.sign({id}, JWT_SECRET, { expiresIn: '7d'});
}

const isAuthorised = (req, res, next) => {

  const { authorization  } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ 'message': 'Необходима авторизация'});
  }

  const token = authorization.replace('Bearer', '');

  const payload = jwt.verify(token, '')

}

module.exports = {
  getJwtToken,
  isAuthorised
}
