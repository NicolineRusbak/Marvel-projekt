const express = require('express');
const cors = require('cors');
const characters = require('./routes/characters'); // books
const movies = require('./routes/movies'); // movies

const app = express();
const myPort = ;

app.use(cors());    // to enable cross origin resource sharing when accessed from browser
app.use(setJSON); // Hvad gør den her?
app.use(express.json());    // to process the incoming request (request body MUST be in json format) and create the req.body object for later use


app.use('/api/characters', characters);
app.use('/api/movies', movies);

app.listen(myPort, () => console.log(`Listening on port ${myPort}...`));