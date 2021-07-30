const jwt = require('jsonwebtoken');
const passport = require('passport');
require('./passport');

/**
 * The data of the constanst is stored in an environmental variable
 * and is used for encoding and decoding the JWT token
 * @constant
 * @type {string}
 */
const jwtSecret = 'this_is_my_secret';

/**
 * creates a JWT token to verify the user is the same
 */
const generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username,
    expiresIn: '3d',
    algorithm: 'HS256'
  });
};

/**
 * creates an endpoint for users to login with verification
 */
module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        const token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};
