const express = require('express');
const router = express.Router();
const Quote = require('../models/quote');
const auth = require('../middleware/authenticate');
const admin = require('../middleware/admin');

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
// , [auth, admin]
router.delete('/:quoteId', async (req, res) => {
    try {
        const validateQuoteID = Quote.validate(req.params);
        if (validateQuoteID.error) throw { statusCode: 400, message: validateQuoteID.error };

        const quoteToBeDeleted = await Quote.readById(req.params.quoteId);

        const deletedQuote = await quoteToBeDeleted.delete();

        res.send(JSON.stringify(deletedQuote));
    }
    catch (err) {
        let errorMessage;
        if (!err.statusCode) {
            errorMessage = {
                statusCode: 500,
                message: err
            }
        } else {
            errorMessage = err;
        }
        res.status(errorMessage.statusCode).send(JSON.stringify(errorMessage));
    }
});

module.exports = router;