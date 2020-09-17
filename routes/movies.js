const { application } = require('express');
const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');

router.get('/', async (req, res) => {
    res.setHesder('Content-Type', 'application/json');

    try {
        const movies = await Movie.readAll();
        res.send(JSON.stringify(movies));
    }
    catch(err) {
        res.status(418).send(JSON.stringify(err));
    }
});

router.get('/:movieId', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const paramsTestObject = {
        movieId: req.params.movieId
    }
    const {error} = Movie.validate(paramsTestObject);
    if (error) {
        res.status(400).send(JSON.stringify(error));
    } else { 
        try { const movie = await Movie.readById(req.params.movieId);
        res.status(418).send(JSON.stringify(err));
        }
        catch (err){
            res.status(418).send(JSON.stringify(err));
        }
    }
});

module.exports = router;