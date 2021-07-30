const cors = require('cors');
/**
 * Express is used to create and maintain web servers as well as manage HTTP
 * requests. Rather than using modules (e.g., the HTTP module), you can simply
 * use Express to route requests/responses and interact with request data.
 */
const express = require('express');
const morgan = require('morgan');//A logging middleware for Express
/**
 * Mongoose provides a straight-forward, schema-based solution to model your application data
 */
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
/**
 * The body-parser middleware module allows you to read the “body” of HTTP
 * requests within your request handlers simply by using the code req.body.
 * const passport = require('passport'); //Passport is an authentication
 * middleware
 */
require('./passport');

const { check, validationResult } = require('express-validator');
const models = require('./models.js');

const Movies = models.Movie;
const Users = models.User;
const app = express(); //calling app.anything uses an instance of express
const port = process.env.PORT || 8080;

/**
 * Allows CORS only for the websites listed in this array
 * @constant
 * @type {array}
 */

const allowedOrigins = ['http://localhost:8080', 'http://localhost:4200', 'http://localhost:1234', 'https://andreascampan.github.io', 'https://andreascampan.github.io/Angular-myFlix', 'https://film-quarry.netlify.app', ' https://filmquarry.herokuapp.com/'];

/**
 * Declaring app.use before the routes means that each route request
 * will run all the following app.use on it.
 */

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const message = `The CORS policy for this application doesn’t allow access from origin ${origin}`;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

app.use(bodyParser.json());
app.use(morgan('common'));
app.use(express.static('public'));
app.use((err, req, res, next) => { //err catches on the server error
  console.error(err.stack);
  res.status(500).send('The Planet hosting the server must have exploded!');
});

//mongoose.connect('mongodb://localhost:27017/filmquarry', { useNewUrlParser: true, useUnifiedTopology: true });

/**
 * allows the API to make CRUD operations on the dataase
 */
mongoose.connect(process.env.connection_var, { useNewUrlParser: true, useUnifiedTopology: true });

require('./auth')(app);
//...............................................Get the Documentation HTML
app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/', (req, res) => {
  res.status(500).send('You are now on the main page! Welcome to FilmQuarry!');
});

//...............................................Get a list of all the movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

//...............................................Get a Movie by title
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.title })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

//...............................................Get Genre Info by Title
app.get('/movies/genre/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.name },
    {
      'Genre.Name': 1,
      'Genre.Description': 1,
      _id: 0
    })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error ${err}`);
    });
});

//...............................................Get Director Info by Name
app.get('/movies/director/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.name },
    {
      'Director.Name': 1,
      'Director.Bio': 1,
      'Director.Born': 1,
      'Director.Died': 1,
      _id: 0
    })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error ${err}`);
    });
});

//...............................................Get user by Username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error ${err}`);
    });
});

//...............................................Get all Users
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(200).json(users);
    }).catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

//.................................................Add a new user
app.post('/users', [
  check('Username', 'A username is required, minimum 5 characters').isLength({ min: 5 }),
  check('Username', 'The username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', ' A password is required').not().isEmpty(),
  check('Email', 'THe email does not appear to be valid').isEmail()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(`The username: ${req.body.Username} already exists, please choose another username.`);
      }
      Users.create({
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        DOB: req.body.DOB
      })
        .then((newUser) => { res.status(201).send(`Thank you for subscribing to filmquarry ${newUser.Username}! You will be redirected shortly!`); })
        .catch((error) => {
          console.error(error);
          res.status(500).send(`Error: ${error}`);
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send(`Error: ${error}`);
    });
});

//..........................................Update a user's info, by username

app.put('/users/:Username', passport.authenticate('jwt', { session: false }), [
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Email', 'Email does not appear to be valid').isEmail()
], async (req, res) => {
  const errors = validationResult(req);
  const preData = await Users.findOne({ Username: req.params.Username });

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (req.body.Password === '') {
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username || preData.Username,
          Email: req.body.Email || preData.Email,
          DOB: req.body.DOB || preData.DOB
        }
      },
      { new: true },
      (err, updateUser) => {
        if (err) {
          console.error(err);
          res.status(500).send(`Error: ${err}`);
        } else {
          res.json(updateUser);
        }
      }
    );
  } else {
    const hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username || preData.Username,
          Password: hashedPassword,
          Email: req.body.Email || preData.Email,
          DOB: req.body.DOB || preData.DOB
        }
      },
      { new: true },
      (err, updateUser) => {
        if (err) {
          console.error(err);
          res.status(500).send(`Error: ${err}`);
        } else {
          res.json(updateUser);
        }
      }
    );
  }
});

//.......................................Add a movie to users fav movies list
app.patch('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username },
    {
      $addToSet: { movieFav: req.params.MovieID }
    },
    { new: true })
    .then((users) => {
      res.status(201).json(`${users.movieFav} has been added to your favourites`);
    }).catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

//................................Remove a movie from a users fav movies list
app.delete('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username },
    {
      $pull: { movieFav: req.params.MovieID }
    },
    { new: true },
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      } else {
        res.json(`${req.params.MovieID} has been removed from your favourites`);
      }
    });
});

//................................................Delete a user by Username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(`${req.params.Username} was not found`);
      } else {
        res.status(200).send(`${req.params.Username} your account has been deleted! We're sorry to see you go, please email us at filmquarry@support.com and let us know how we can improve.`);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Listening on Port ${port}`);
});
