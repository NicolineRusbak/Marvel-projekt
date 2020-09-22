const express = require('express');
const cors = require('cors');
const characters = require('./routes/characters');
const login = require('./routes/login');
const users = require('./routes/users');
const movies = require('./routes/movies');
const quotes = require('./routes/quotes');
const setJSON = require('./middleware/setResponseHeaderToJSON');

const app = express();
const myPort = ;

app.use(cors());    // to enable cross origin resource sharing when accessed from browser
app.use(express.json());    // to process the incoming request (request body MUST be in json format) and create the req.body object for later use

app.use('/api/characters', characters);
app.use('/api/login', login);
app.use('/api/users', users);
app.use('/api/movies', movies);
app.use('/api/quotes', quotes);

app.listen(myPort, () => console.log(`Listening on port ${myPort}...`));