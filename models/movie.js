const con = require('../config/connection');
const sql = require('mssql');
const Joi = require('joi');
const _ = require('lodash');
const Character = require('./character');

class Movie {
    // constructor
    constructor(movieObj) {
        this.movieId = movieObj.movieId;
        this.movieTitle = movieObj.movieTitle;
        this.movieDescription = movieObj.movieDescription;
        this.movieReleaseYear = movieObj.movieReleaseYear;
        this.characters = _.cloneDeep(movieObj.characters);
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
            characters: Joi.array().items(
                Joi.object({
                    characId: Joi.number()
                        .integer()
                        .min(1),
                    characFirstName: Joi.string()
                        .max(50),
                    characLastName: Joi.string()
                        .max(50)
                        .allow('', null),
                    characAlias: Joi.string()
                        .max(50),
                    characDateOfBirth: Joi.string()
                        .max(50)
                        .allow('', null),
                    characGender: Joi.string()
                        .max(10),
                    characJob: Joi.string()
                        .max(50)
                        .allow('', null),
                    characOrigin: Joi.string()
                        .max(50),
                    characAbility: Joi.string()
                        .max(50),
                    characWeakness: Joi.string()
                        .max(50),
                    characArtefact: Joi.string()
                        .max(50)
                        .allow('', null),
                    characActor: Joi.string()
                        .max(50)
                })
                    .or('characID', 'characAlias')
            )
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
                        .query(`SELECT *
                                FROM marvelMovie
                                INNER JOIN marvelCharacMovie
                                ON marvelMovie.movieID = marvelCharacMovie.FK_movieID
                                INNER JOIN marvelCharacter
                                ON marvelCharacMovie.FK_characID = marvelCharacter.characID
                                ORDER BY marvelMovie.movieID`)

                    console.log(result);

                    const movies = [];
                    let currentMovieId = 0;
                    result.recordset.forEach(record => {
                        if (record.movieID == currentMovieId) {
                            const character = {
                                characId: record.characID,
                                characFirstName: record.characFirstName,
                                characLastName: record.characLastName,
                                characAlias: record.characAlias,
                                characDateOfBirth: record.characDateOfBirth,
                                characGender: record.characGender,
                                characJob: record.characJob,
                                characOrigin: record.characOrigin,
                                characAbility: record.characAbility,
                                characWeakness: record.characWeakness,
                                characArtefact: record.characArtefact,
                                characActor: record.characActor
                            };

                            const { error } = Character.validate(character);
                            if (error) throw { statusCode: 409, message: error };

                            _.last(movies).characters.push(new Character(character));
                        } else {
                            const movieWannabe = {
                                movieId: record.movieID,
                                movieTitle: record.movieTitle,
                                movieDescription: record.movieDescription,
                                movieReleaseYear: record.movieReleaseYear,
                                characters: [
                                    {
                                        characId: record.characID,
                                        characFirstName: record.characFirstName,
                                        characLastName: record.characLastName,
                                        characAlias: record.characAlias,
                                        characDateOfBirth: record.characDateOfBirth,
                                        characGender: record.characGender,
                                        characJob: record.characJob,
                                        characOrigin: record.characOrigin,
                                        characAbility: record.characAbility,
                                        characWeakness: record.characWeakness,
                                        characArtefact: record.characArtefact,
                                        characActor: record.characActor
                                    }
                                ]
                            };

                            const { error } = Movie.validate(movieWannabe);
                            if (error) throw { statusCode: 409, message: error };

                            movies.push(new Movie(movieWannabe));

                            currentMovieId = movieWannabe.movieID; // skulle have været med lille Id, men så kommer der intet resultat overhovedet
                        }
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

    static readById(movieId) {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                        .input('movieId', sql.Int, movieId)
                        .query(`SELECT * FROM marvelMovie 
                                INNER JOIN marvelCharacMovie
                                ON marvelMovie.movieID = marvelCharacMovie.FK_movieID
                                INNER JOIN marvelCharacter
                                ON marvelCharacMovie.FK_characID = marvelCharacter.characID
                                WHERE movieID = @movieID`);

                    console.log(result);

                    const movies = [];
                    let currentMovieId = 0;
                    result.recordset.forEach(record => {
                        if (record.movieID == currentMovieId) {
                            const character = {
                                characId: record.characID,
                                characFirstName: record.characFirstName,
                                characLastName: record.characLastName,
                                characAlias: record.characAlias,
                                characDateOfBirth: record.characDateOfBirth,
                                characGender: record.characGender,
                                characJob: record.characJob,
                                characOrigin: record.characOrigin,
                                characAbility: record.characAbility,
                                characWeakness: record.characWeakness,
                                characArtefact: record.characArtefact,
                                characActor: record.characActor
                            };

                            const { error } = Character.validate(character);
                            if (error) throw { statusCode: 409, message: error };

                            _.last(movies).characters.push(new Character(character));

                        } else {
                            const movieWannabe = {
                                movieId: record.movieID,
                                movieTitle: record.movieTitle,
                                movieDescription: record.movieDescription,
                                movieReleaseYear: record.movieReleaseYear,
                                characters: [
                                    {
                                        characId: record.characID,
                                        characFirstName: record.characFirstName,
                                        characLastName: record.characLastName,
                                        characAlias: record.characAlias,
                                        characDateOfBirth: record.characDateOfBirth,
                                        characGender: record.characGender,
                                        characJob: record.characJob,
                                        characOrigin: record.characOrigin,
                                        characAbility: record.characAbility,
                                        characWeakness: record.characWeakness,
                                        characArtefact: record.characArtefact,
                                        characActor: record.characActor
                                    }
                                ]
                            };
                            const { error } = Movie.validate(movieWannabe);
                            if (error) throw { statusCode: 409, message: error };

                            movies.push(new Movie(movieWannabe));

                            currentMovieId = movieWannabe.movieID; // lille id?
                        }
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

    // create a new movie in the db
    create() {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const pool = await sql.connect(con);
                    let result = {};
                    if (this.character.characID) {
                        result = await pool.request()
                            .input('movieTitle', sql.NVarChar(50), this.movieTitle) // title
                            .input('movieDescription', sql.NVarChar(1000), this.movieDescription) // description
                            .input('movieReleaseYear', sql.Int, this.movieReleaseYear) // release year
                            .input('FK_characID', sql.Int, this.character.characID)
                            .query(`INSERT INTO marvelMovie (movieTitle, movieDescription, movieReleaseYear, FK_characID) 
                                    VALUES (@movieTitle, @movieDescription, @movieReleaseYear, @FK_characID); 
                                    SELECT * FROM marvelMovie INNER JOIN marvelCharacter ON marvelMovie.FK_characID = marvelCharacter.characID
                                    WHERE marvelMovie.movieID = SCOPE_IDENTITY()`);
                    } else {
                        result = await pool.request()
                            .input('movieTitle', sql.NVarChar(50), this.movieTitle) // title
                            .input('movieDescription', sql.NVarChar(1000), this.movieDescription) // description
                            .input('movieReleaseYear', sql.Int, this.movieReleaseYear) // release year
                            .input('characFirstName', sql.NVarChar(50), this.character.characFirstName)
                            .input('characLastName', sql.NVarChar(50), this.character.characLastName)
                            .input('characAlias', sql.NVarChar(50), this.character.characAlias)
                            .input('characDateOfBirth', sql.NVarChar(10), this.character.characDateOfBirth)
                            .input('characGender', sql.NVarChar(10), this.character.characGender)
                            .input('characJob', sql.NVarChar(50), this.character.characJob)
                            .input('characOrigin', sql.NVarChar(50), this.character.characOrigin)
                            .input('characAbility', sql.NVarChar(50), this.character.characAbility)
                            .input('characWeakness', sql.NVarChar(50), this.character.characWeakness)
                            .input('characArtefact', sql.NVarChar(50), this.character.characArtefact)
                            .input('characActor', sql.NVarChar(50), this.character.characActor)
                            .query(`INSERT INTO marvelCharacter (characFirstName, characLastName, characAlias, characDateOfBirth, characGender, characJob, characOrigin, characAbility, characWeakness, characArtefact, characActor)
                                    VALUES (@characFirstName, @characLastName, @characAlias, @characDateOfBirth, @characGender, @characJob, @characOrigin, @characAbility, @characWeakness, @characArtefact, @characActor);
                                    INSERT INTO marvelMovie (movieTitle, movieDescription, movieReleaseYear, FK_characID) 
                                    VALUES (@movieTitle, @movieDescription, @movieReleaseYear, SCOPE_IDENTITY()); 
                                    SELECT * FROM marvelMovie INNER JOIN marvelCharacter ON marvelMovie.FK_characID = marvelCharacter.characID
                                    WHERE marvelMovie.movieID = SCOPE_IDENTITY()`)
                    }

                    console.log(result);
                    if (!result.recordset[0]) throw { message: 'Movie not found. Failed to save Movie to database.' };

                    const record = {
                        movieId: result.recordset[0].movieID, //movieId
                        movieTitle: result.recordset[0].movieTitle, //title
                        movieDescription: result.recordset[0].movieDescription, // description
                        movieReleaseYear: result.recordset[0].movieReleaseYear, // release year
                        characters: {
                            characId: result.recordset[0].characID,
                            characFirstName: result.recordset[0].characFirstName,
                            characLastName: result.recordset[0].characLastName,
                            characAlias: result.recordset[0].characAlias,
                            characDateOfBirth: result.recordset[0].characDateOfBirth,
                            characGender: result.recordset[0].characGender,
                            characJob: result.recordset[0].characJob,
                            characOrigin: result.recordset[0].characOrigin,
                            characAbility: result.recordset[0].characAbility,
                            characWeakness: result.recordset[0].characWeakness,
                            characArtefact: result.recordset[0].characArtefact,
                            characActor: result.recordset[0].characActor
                        }
                    }

                    const { error } = Movie.validate(record);
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