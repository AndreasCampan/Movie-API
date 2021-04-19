const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

const userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  DOB: { type: Date, required: true },
  movieFav: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

userSchema.statics.hashPassword = (password) => bcrypt.hashSync(password, 10);

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

//The first argument is the singular name of the collection your model is for. Mongoose automatically looks for the plural, lowercased version of your model name.
const Movie = mongoose.model('Movie', movieSchema);
const User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
