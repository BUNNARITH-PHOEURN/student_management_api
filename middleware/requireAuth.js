const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'user_secret';

function getToken(req) {
  const authorization = req.get('authorization');

  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.slice(7);
  }

  return req.cookies && req.cookies.sms_token;
}

function unauthorized(req, res) {
  const isPageRequest = req.method === 'GET' && req.accepts(['html', 'json']) === 'html';

  if (isPageRequest) {
    return res.redirect('/login');
  }

  return res.status(401).json({ message: 'Please log in to continue.' });
}

module.exports = function requireAuth(req, res, next) {
  const token = getToken(req);

  if (!token) {
    return unauthorized(req, res);
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch (error) {
    res.clearCookie('sms_token');
    return unauthorized(req, res);
  }
};
