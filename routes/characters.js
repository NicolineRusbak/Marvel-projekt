const express = require('express');
const router = express.Router();
const Character = require('../models/character');

router.get('/', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    try {
        const characters = await Character.readAll();
        res.send(JSON.stringify(characters));
    }
    catch (err) {
        res.status(418).send(JSON.stringify(err));
    }
});

router.get('/:characId', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    //res.send(JSON.stringify({message: 'GET /api/authors/:authorId'}));
    const paramsTestObject = {
        characId: req.params.characId
    }
    const {error} = Character.validate(paramsTestObject);
    if (error) {
        res.status(400).send(JSON.stringify(error));
    } else {
        try {
            const character = await Character.readById(req.params.characId);
            res.send(JSON.stringify(character));
            // evt er det her at man kan indsætte referencen til movies
        }
        catch (err){
            res.status(418).send(JSON.stringify(err));
        }
    }
});

module.exports = router;