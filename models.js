const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * defines the structure of the movie document and its default values,
 * validators and what is and isn't required.
 * @constant
 * @type {function}
 */
const movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: { type: String, required: true },
    Description: String
  },

  Director: {
    Name: { type: String, required: true },
    Bio: String,
    Born: String,
    Died: String
  },

  ImagePath: { type: String, required: true },
  Featured: Boolean
});

/**
 * defines the structure of the user document and its default values, 
 * validators and what is and isn't required.
 * @constant
 * @type {function}
 */
const userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  DOB: { type: Date, required: true },
  movieFav: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

/**
 * hashes the password so that it cannot be read in the database keeping
 * the users data secured
 */
userSchema.statics.hashPassword = (password) => bcrypt.hashSync(password, 10);

/**
 * compares the password recieved with the hashed password
 */
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

/**
 * Models provide an interface to the database for creating, querying,
 * updating, deleting records, etc
 */
const Movie = mongoose.model('Movie', movieSchema);
const User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
