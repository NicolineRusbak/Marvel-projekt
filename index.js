const express = require('express');
const cors = require('cors');
const characters = require('./routes/characters'); // books

const app = express();
const myPort = 8543;

app.use(cors());    // to enable cross origin resource sharing when accessed from browser
app.use(express.json());    // to process the incoming request (request body MUST be in json format) and create the req.body object for later use
app.use('/api/characters', characters);

app.listen(myPort, () => console.log(`Listening on port ${myPort}...`));