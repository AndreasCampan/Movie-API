const express = require('express');
const morgan = require('morgan');

const app = express();
const topMovies = [
  {
    title: 'Forrest Gump',
  },
  {
    title: 'Cast Away',
  },
  {
    title: 'The Imitation Game',
  },
  {
    title: 'Shawshank Redemption',
  },
  {
    title: 'Saving Private Ryan',
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

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.get('/', (req, res) => {
  res.send('Welcome to my top 10 movies!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.listen(8080, () => {
  console.log('The web server is listening on port 8080!');
});
