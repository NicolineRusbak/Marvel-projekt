const con = require('../config/connection');
const sql = require('mssql');
const Joi = require('joi');

class Quote {
    // constuctor
    constructor(quoteObj) {
        this.quoteId = quoteObj.quoteId;
        this.quoteText = quoteObj.quoteText;
        this.quoteMovie = quoteObj.quoteMovie;
    }

    // validate
    static validate(quoteObj) {
        const schema = Joi.object({
            quoteId: Joi.number()
                .integer()
                .min(1),
            quoteText: Joi.string()
                .max(255),
            quoteMovie: Joi.string()
                .max(50),
        });

        return schema.validate(quoteObj);
    }

    // readAll
    static readAll() {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                        .query(`SELECT * FROM marvelQuote`);

                    const quotes = [];
                    result.recordset.forEach(record => {
                        const quoteWannabe = {
                            quoteId: record.quoteID,
                            quoteText: record.quoteText,
                            quoteMovie: record.quoteMovie,
                        }

                        const { error } = Quote.validate(quoteWannabe);
                        if (error) throw error;

                        quotes.push(new Quote(quoteWannabe));
                    });

                    resolve(quotes);

                }
                catch (err) {
                    console.log(err);
                    reject(err);
                }
                sql.close();
            })();
        });
    }
    static readById(id) {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                        .input('quoteID', sql.Int, id)
                        .query(`SELECT * FROM marvelQuote
                            WHERE marvelQuote.quoteID = @quoteID`);
                    console.log(result);
                    if (result.recordset.length == 0) throw { statusCode: 404, message: 'Quote not found.' };
                    if (result.recordset.length > 1) throw { statusCode: 500, message: 'Multiple quotes found with same ID. DB is corrupt.' };
                    const record = {
                        quoteId: result.recordset[0].quoteID,
                        quoteText: result.recordset[0].quoteText,
                        quoteMovie: result.recordset[0].quoteMovie,
                    }

                    const { error } = Quote.validate(record);
                    if (error) throw error;

                    resolve(new Quote(record));
                }
                catch (err) {
                    console.log(err);
                    let errorMessage;
                    if (!err.statusCode) {
                        errorMessage = {
                            statusCode: 500,
                            message: err
                        }
                    } else {
                        errorMessage = err;
                    }
                    reject(errorMessage);
                }
                sql.close();
            })();
        });
    }
    create() {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const pool = await sql.connect(con);
                    let result = {};
                    result = await pool.request()
                        .input('quoteText', sql.NVarChar(255), this.quoteText)
                        .input('quoteMovie', sql.NVarChar(50), this.quoteMovie)
                        .query(`INSERT INTO marvelQuote (quoteText, quoteMovie)
                                VALUES (@quoteText, @quoteMovie);
                                SELECT * FROM marvelQuote WHERE marvelQuote.quoteID = SCOPE_IDENTITY()`);
                    console.log(result);
                    if (!result.recordset[0]) throw { message: 'Failed to save quote to database.' };

                    const record = {
                        quoteId: result.recordset[0].quoteID,
                        quoteText: result.recordset[0].quoteText,
                        quoteMovie: result.recordset[0].quoteMovie,
                    }

                    const { error } = Quote.validate(record);
                    if (error) throw error;

                    resolve(new Quote(record));
                }
                catch (err) {
                    console.log(err);
                    reject(err);
                }
                sql.close();
            })();
        });

    }
    delete() {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                        .input('quoteID', sql.Int, this.quoteId)
                        .query(`SELECT * FROM marvelQuote
                                WHERE marvelQuote.quoteID = @quoteID;
                                DELETE FROM marvelQuote
                                WHERE quoteID = @quoteID;`);
                    console.log(result);
                    if (result.recordset.length == 0) throw { statusCode: 404, message: 'Quote not found' };
                    if (result.recordset.length > 1) throw { statusCode: 500, message: 'Multiple quotes found with same ID. DB is corrupt.' };
                    const record = {
                        quoteId: result.recordset[0].quoteID,
                        quoteText: result.recordset[0].quoteText,
                        quoteMovie: result.recordset[0].quoteMovie,
                    }

                    const { error } = Quote.validate(record);
                    if (error) throw error;

                    resolve(new Quote(record));
                }
                catch (err) {
                    console.log(err);
                    let errorMessage;
                    if (!err.statusCode) {
                        errorMessage = {
                            statusCode: 500,
                            message: err
                        }
                    } else {
                        errorMessage = err;
                    }
                    reject(errorMessage);
                }
                sql.close()
            })();
        });
    }
}
module.exports = Quote;