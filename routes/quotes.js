const express = require('express');
const router = express.Router();
const Quote = require('../models/quote');

router.get('/', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const quotes = await Quote.readAll();
        res.send(JSON.stringify(quotes));
    }
    catch (err) {
        res.status(418).send(JSON.stringify(err));
    }
});

router.post('/', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const { error } = Quote.validate(req.body);
    if (error) {
        res.status(400).send(JSON.stringify(error));
    } else {
        try {
            const quote = await new Quote(req.body).create();
            res.send(JSON.stringify(quote));
        }
        catch (err) {
            res.status(418).send(JSON.stringify(err));
        }
    }
});

module.exports = router;