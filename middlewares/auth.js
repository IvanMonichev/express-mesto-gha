const { isAuthorised } = require('../utils/jwt');

const checkAuthorization = (req, res, next) => {

  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.send(401).send({ 'message': 'Необходима авторизация' })
  }

  const token = authorization.replace('Bearer ', '');

  if(!isAuthorised(token)) {
    return res.status(401).send({ 'message': 'Недостаточно прав' })
  };

  next();
}
