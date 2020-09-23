const con = require('../config/connection');
const sql = require('mssql');
const Joi = require('joi');

class Movie {
    // constructor
    constructor(movieObj) {
        this.movieId = movieObj.movieId;
        this.movieTitle = movieObj.movieId;
        this.movieDescription = movieObj.movieDescription;
        this.movieReleaseYear = movieObj.movieReleaseYear;
    }

    // validate 
    static validate(movieObj) {
        const schema = Joi.object({
            movieId: Joi.number()
                .integer()
                .min(1),
            movieTitle: Joi.string()
                .max(50),
            movieDescription: Joi.string()
                .max(1000),
            movieReleaseYear: Joi.number()
                .integer()
                .min(1),
        });

        return schema.validate(movieObj);
    }

    // read all
    static readAll() {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                        .query('SELECT * FROM marvelMovie');

                    const movies = [];
                    result.recordset.forEach(record => {
                        const movieWannabe = {
                            movieId: record.movieID,
                            movieTitle: record.movieTitle,
                            movieDescription: record.movieDescription,
                            movieReleaseYear: record.movieReleaseYear
                        }   

                        const { error } = Movie.validate(movieWannabe);
                        if (error) throw error;

                        movies.push(new Movie(movieWannabe));
                    });

                    resolve(movies);

                }
                catch (err) {
                    console.log(err);
                    reject(err);
                }
                sql.close();
            })();
        });
    }
    static readById(movieId){
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                        .input('movieId', sql.Int, movieId)
                        .query('SELECT * FROM marvelMovie WHERE movieId = @movieId');   

                    console.log(result);
                    if (!result.recordset[0]) throw { message: 'Movie not found.'};

                    const record = {
                        movieId: result.recordset[0].movieID,
                        movieTitle: result.recordset[0].movieTitle,
                        movieDescription: result.recordset[0].movieDescription,
                        movieReleaseYear: result.recordset[0].movieReleaseYear
                    }

                    const {error} = Movie.validate(record);
                    if (error) throw error;

                    resolve(new Movie(record));
                }
                catch (err) {
                    console.log(err);
                    reject(err);
                }
                sql.close();
            })();
        });
    }
}

module.exports = Movie;