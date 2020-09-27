const con = require('../config/connection');
const sql = require('mssql');
const Joi = require('joi');
const _ = require('lodash');
const Movie = require('./movie');

class Character {
    // constructor
    constructor(characterObj) {
        this.characId = characterObj.characId;
        this.characFirstName = characterObj.characFirstName;
        this.characLastName = characterObj.characLastName;
        this.characAlias = characterObj.characAlias;
        this.characDateOfBirth = characterObj.characDateOfBirth;
        this.characGender = characterObj.characGender;
        this.characJob = characterObj.characJob;
        this.characOrigin = characterObj.characOrigin;
        this.characAbility = characterObj.characAbility;
        this.characWeakness = characterObj.characWeakness;
        this.characArtefact = characterObj.characArtefact;
        this.characActor = characterObj.characActor;
        this.movies = _.cloneDeep(characterObj.movies);
    }

    // validate
    static validate(characterObj) {
        const schema = Joi.object({
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
                .max(50),
            movies: Joi.array().items(
                Joi.object({
                    movieId: Joi.number()
                        .integer()
                        .min(1),
                    movieTitle: Joi.string()
                        .max(50),
                    movieDescription: Joi.string()
                        .max(1000),
                    movieReleaseYear: Joi.number()
                        .integer()
                        .min(1)
                })
                .or('movieID', 'movieTitle')
            )
        });

        return schema.validate(characterObj);
    }

    // readAll
    static readAll() {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                        .query(`SELECT *
                                FROM marvelCharacter
                                INNER JOIN marvelCharacMovie
                                ON marvelCharacter.characID = marvelCharacMovie.FK_characID
                                INNER JOIN marvelMovie
                                ON marvelCharacMovie.FK_movieID = marvelMovie.movieID
                                ORDER BY marvelCharacter.characID`);

                    console.log(result);

                    const characters = [];
                    let currentCharacterId = 0;
                    result.recordset.forEach(record => {
                        if (record.characID == currentCharacterId) {
                            const movie = {
                                movieId: record.movieID,
                                movieTitle: record.movieTitle,
                                movieDescription: record.movieDescription,
                                movieReleaseYear: record.movieReleaseYear
                            };

                            const { error } = Movie.validate(movie);
                            if (error) throw { statusCode: 409, message: error };

                            _.last(characters).movies.push(new Movie(movie));
                        } else {
                            const characterWannabe = {
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
                                characActor: record.characActor,
                                movies: [
                                    {
                                        movieId: record.movieID,
                                        movieTitle: record.movieTitle,
                                        movieDescription: record.movieDescription,
                                        movieReleaseYear: record.movieReleaseYear
                                    }
                                ]
                            };

                            const { error } = Character.validate(characterWannabe);
                            if (error) throw { statusCode: 409, message: error };

                            characters.push(new Character(characterWannabe));

                            currentCharacterId = characterWannabe.characId;
                        }
                    });

                    resolve(characters);

                }
                catch (err) {
                    console.log(err);
                    reject(err);
                }
                sql.close();
            })();
        });
    }

    // readById
    static readById(characId) {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                        .input('characId', sql.Int, characId)
                        .query(`SELECT * FROM marvelCharacter 
                                INNER JOIN marvelCharacMovie
                                ON marvelCharacter.characID = marvelCharacMovie.FK_characID
                                INNER JOIN marvelMovie
                                ON marvelCharacMovie.FK_movieID = marvelMovie.movieID
                                WHERE characID = @characID`);

                    console.log(result);
                    if (!result.recordset[0]) throw { message: 'Character not found.' };

                    const characters = [];
                    let currentCharacterId = 0
                    result.recordset.forEach(record => {
                        if (record.characID == currentCharacterId) {
                            const movie = {
                                movieId: record.movieID,
                                movieTitle: record.movieTitle,
                                movieDescription: record.movieDescription,
                                movieReleaseYear: record.movieReleaseYear,
                            };

                            const { error } = Movie.validate(movie);
                            if (error) throw { statusCode: 409, message: error };

                            _.last(characters).movies.push(new Movie(movie));
                        } else {
                            const characterWannabe = {
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
                                characActor: record.characActor,
                                movies: [
                                    {
                                        movieId: record.movieID,
                                        movieTitle: record.movieTitle,
                                        movieDescription: record.movieDescription,
                                        movieReleaseYear: record.movieReleaseYear,
                                    }
                                ]
                            };

                            const { error } = Character.validate(characterWannabe);
                            if (error) throw { statusCode: 409, message: error };

                            characters.push(new Character(characterWannabe));

                            currentCharacterId = characterWannabe.characId;
                        }
                    });

                    resolve(characters);

                }
                catch (err) {
                    console.log(err);
                    reject(err);
                }
                sql.close();
            })();
        });
    }

    // create a new character in the db
    create() {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const pool = await sql.connect(con);
                    let result = {};
                    if (this.movie.movieID) {
                        result = await pool.request()
                        .input('characFirstName', sql.NVarChar(50), this.characFirstName)
                        .input('characLastName', sql.NVarChar(50), this.characLastName)
                        .input('characAlias', sql.NVarChar(50), this.characAlias)
                        .input('characDateOfBirth', sql.NVarChar(10), this.characDateOfBirth)
                        .input('characGender', sql.NVarChar(10), this.characGender)
                        .input('characJob', sql.NVarChar(50), this.characJob)
                        .input('characOrigin', sql.NVarChar(50), this.characOrigin)
                        .input('characAbility', sql.NVarChar(50), this.characAbility)
                        .input('characWeakness', sql.NVarChar(50), this.characWeakness)
                        .input('characArtefact', sql.NVarChar(50), this.characArtefact)
                        .input('characActor', sql.NVarChar(50), this.characActor)
                        .input('FK_movieID', sql.Int, this.movie.movieID)
                        .query(`INSERT INTO marvelCharacter (characFirstName, characLastName, characAlias, characDateOfBirth, characGender, characJob, characOrigin, characAbility, characWeakness, characArtefact, characActor, FK_movieID)
                                VALUES (@characFirstName, @characLastName, @characAlias, @characDateOfBirth, @characGender, @characJob, @characOrigin, @characAbility, @characWeakness, @characArtefact, @characActor, FK_movieID);
                                SELECT * FROM marvelCharacter INNER JOIN marvelMovie ON marvelCharacter.FK_movieID = marvelMovie.movieID
                                WHERE marvelCharacter.characID = SCOPE_IDENTITY()`);
                    } else {
                        result = await pool.request()
                            .input('characFirstName', sql.NVarChar(50), this.characFirstName)
                            .input('characLastName', sql.NVarChar(50), this.characLastName)
                            .input('characAlias', sql.NVarChar(50), this.characAlias)
                            .input('characDateOfBirth', sql.NVarChar(10), this.characDateOfBirth)
                            .input('characGender', sql.NVarChar(10), this.characGender)
                            .input('characJob', sql.NVarChar(50), this.characJob)
                            .input('characOrigin', sql.NVarChar(50), this.characOrigin)
                            .input('characAbility', sql.NVarChar(50), this.characAbility)
                            .input('characWeakness', sql.NVarChar(50), this.characWeakness)
                            .input('characArtefact', sql.NVarChar(50), this.characArtefact)
                            .input('characActor', sql.NVarChar(50), this.characActor)
                            .input('movieTitle', sql.NVarChar(50), this.movie.movieTitle) 
                            .input('movieDescription', sql.NVarChar(1000), this.movie.movieDescription) 
                            .input('movieReleaseYear', sql.Int, this.movie.movieReleaseYear)
                            .query(`INSERT INTO marvelMovie (movieTitle, movieDescription, movieReleaseYear)
                                    VALUES (@movieTitle, @movieDescription, @movieReleaseYear);
                                    INSERT INTO marvelCharacter (characFirstName, characLastName, characAlias, characDateOfBirth, characGender, characJob, characOrigin, characAbility, characWeakness, characArtefact, characActor, FK_movieID) 
                                    VALUES (@characFirstName, @characLastName, @characAlias, @characDateOfBirth, @characGender, @characJob, @characOrigin, @characAbility, @characWeakness, @characArtefact, @characActor, SCOPE_IDENTITY()); 
                                    SELECT * FROM marvelCharacter INNER JOIN marvelMovie ON marvelCharacter.FK_movieID = marvelMovie.movieID
                                    WHERE marvelCharacter.characID = SCOPE_IDENTITY()`);    
                    }

                    console.log(result);
                    if (!result.recordset[0]) throw { message: 'Character not found. Failed to save Character to database.' };

                    const record = {
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
                        characActor: result.recordset[0].characActor,
                        movies: {
                            movieId: result.recordset[0].movieID, //movieId
                            movieTitle: result.recordset[0].movieTitle, //title
                            movieDescription: result.recordset[0].movieDescription, // description
                            movieReleaseYear: result.recordset[0].movieReleaseYear, // release year 
                        }
                    }

                    const { error } = Character.validate(record);
                    if (error) throw error;

                    resolve(new Character(record));

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

module.exports = Character;