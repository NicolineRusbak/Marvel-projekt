const con = require('../config/connection');
const sql = require('mssql');
const Joi = require('joi');

class Character {
    // constuctor
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
                .max(50)
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
                        .query('SELECT * FROM marvelCharacter');

                    const characters = [];
                    result.recordset.forEach(record => {
                        const characterWannabe = {
                            characId: record.characId,
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

                        const { error } = Character.validate(characterWannabe);
                        if (error) throw error;

                        characters.push(new Character(characterWannabe));
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
    // readById slettet men kan tages fra Library-version5
    static readById(characId){
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                        .input('characId', sql.Int, characId)
                        .query('SELECT * FROM marvelCharacter WHERE characId = @characId');

                    console.log(result);
                    if (!result.recordset[0]) throw { message: 'Character not found.'};

                    const record = {
                        characId: result.recordset[0].characId,
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

                    const {error} = Character.validate(record);
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

    // create slettet men kan tages fra Library-version5

}

module.exports = Character;