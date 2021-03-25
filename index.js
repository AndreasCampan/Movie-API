const express = require('express');
const morgan = require('morgan');

const app = express();
const movies = [
  {
    title: 'Forrest Gump',
    genre: [
      'drama',
      'romance'
    ],
    director: 'Robert Zemeckis',
    image: 'https://upload.wikimedia.org/wikipedia/en/6/67/Forrest_Gump_poster.jpg'
  },
  {
    title: 'Cast Away',
    genre: [
      'drama',
      'adventure'
    ],
    director: 'Robert Zemeckis',
    image: 'https://m.media-amazon.com/images/M/MV5BN2Y5ZTU4YjctMDRmMC00MTg4LWE1M2MtMjk4MzVmOTE4YjkzXkEyXkFqcGdeQXVyNTc1NTQxODI@._V1_UY1200_CR90,0,630,1200_AL_.jpg'
  },
  {
    title: 'The Imitation Game',
  },
  {
    title: 'Shawshank Redemption',
  },
  {
    title: 'The Martian',
  },
  {
    title: "A Knight's Tale",
  },
  {
    title: 'Good Will Hunting',
  },
  {
    title: 'A Beautiful Mind',
  },
  {
    title: 'Passion of the Christ',
  },
  {
    title: 'Iron Man',
  }
];

app.use(morgan('common'));
app.use(express.static('public'));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('The Planet hosting the server must have exploded!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
  res.json(movies);
});

app.get('/movies/:title', (req, res) => {
  res.json(movies.find((movie) => movie.title === req.params.title));
});

app.get('/movies/genres/:name', (req, res) => {
  res.send('Here is a description of the ________ movie genre!');
});

app.get('/directors/:name', (req, res) => {
  res.send('Here is the data about the director!');
});

app.post('/users', (req, res) => {
  res.send('Thank you for subscribing to myFlix!');
});

app.put('/users/:name/:nameChange', (req, res) => {
  res.send('Thank you for updating your username!');
});

app.delete('/users/:name', (req, res) => {
  res.send('Your account has been deleted!');
});

app.post('/users/:name/favMovies/:title', (req, res) => {
  res.send('Your movie has been added to your favourites!');
});

app.delete('/users/:name/favMovies/:title', (req, res) => {
  res.send('Your movie has been removed from your favourites!');
});

app.listen(8080, () => {
  console.log('The web server is listening on port 8080!');
});
