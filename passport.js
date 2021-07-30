/**
 * @constant
 * imports the passport authentication middleware for node.js.
 * Used with Express
 */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const Models = require('./models.js');

const Users = Models.User;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

/**
 * http authentication strategy
 */
passport.use(new LocalStrategy({
  usernameField: 'Username',
  passwordField: 'Password'
}, (username, password, callback) => {
  Users.findOne({ Username: username }, (error, user) => {
    if (error) {
      console.log(error);
      return callback(error);
    }

    if (!user) {
      console.log('incorrect username');
      return callback(null, false, { message: 'Incorrect username.' });
    }

    if (!user.validatePassword(password)) {
      console.log('incorrect password here');
      return callback(null, false, { message: 'Incorrect password.' });
    }

    console.log('finished');
    return callback(null, user);
  });
}));

/**
 * JWT authentication strategy
 */
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'this_is_my_secret'
}, (jwtPayload, callback) => Users.findById(jwtPayload._id)
  .then((user) => callback(null, user))
  .catch((error) => callback(error))));
