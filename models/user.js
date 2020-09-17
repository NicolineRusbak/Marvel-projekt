const con = require('../config/connection');
const sql = require('mssql');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const crypt = require('../config/encrypt');

class User {
    // constructor
    constructor(userObj) {
        this.userId = userObj.userId;
        this.userEmail = userObj.userEmail;
        // add info about the user's role --> role object
        if (userObj.role) {
            this.role = {}
            this.role.roleId = userObj.role.roleId;
            this.role.roleName = userObj.role.roleName;
        }
    }

    // static validate (for User object)
    static validate(userObj) {
        const schema = Joi.object({
            userId: Joi.number()
                .integer()
                .min(1),
            userEmail: Joi.string()
                .email()
                .max(255),
            // add info about the user's role --> role object     
            role: Joi.object({
                roleId: Joi.number()
                    .integer()
                    .min(1),
                roleName: Joi.string()
                    .max(255)
            })
        });

        return schema.validate(userObj);
    }

    // static validateLoginInfo
    static validateLoginInfo(loginInfoObj) {
        const schema = Joi.object({
            email: Joi.string()
                .email()
                .max(255),
            password: Joi.string()
                .min(3)
                .max(255)
        });

        return schema.validate(loginInfoObj);
    }

    // static matchUserEmailAndPassword
    static matchUserEmailAndPassword(loginInfoObj) {
        return new Promise((resolve, reject) => {
            (async () => {
                // we try to:
                // connect to the DB
                // query the userLogin INNER JOIN userPassword (ON the userID) table for all the rows where
                //      userEmail == loginInfoObj.email
                //  
                //  check if i have found one and only user by that email
                //  --> if none found: throw 404 user not found
                //  --> if more than one found: throw 500 database is corrupt
                //
                //  check if the provided password is valid (based on the hashedPassword)
                //  --> if not: throw 404 user not found 
                //
                // check if there is a valid result (valid means one and ONLY one result)
                // create a user object for validation
                // validate the user object
                // if all good, resolve with user object
                // if error, reject with error
                // CLOSE THE DB
                try {
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                        .input('userEmail', sql.NVarChar(255), loginInfoObj.email)
                        .query(`SELECT * FROM marvelUserLogin
                                    INNER JOIN marvelUserPassword
                                        ON marvelUserLogin.userID = marvelUserPassword.FK_userID
                                    INNER JOIN marvelUserLoginRole
                                        ON marvelUserLogin.userID = marvelUserLoginRole.FK_userID
                                    INNER JOIN marvelUserRole
                                        ON marvelUserLoginRole.FK_roleID = marvelUserRole.roleID
                                    WHERE marvelUserLogin.userEmail = @userEmail`);

                    console.log(result);
                    if (!result.recordset[0]) throw { statusCode: 404, message: "User doesn't exist (password)"};
                    if (result.recordset.length > 1) throw { statusCode: 500, message: 'DB is corrupt' };

                    const match = await bcrypt.compare(loginInfoObj.password, result.recordset[0].hashedPassword);
                    if (!match) throw { statusCode: 404, message: 'Wrong password (hashthing)' };

                    const record = {
                        userId: result.recordset[0].userID,
                        userEmail: result.recordset[0].userEmail,
                        role: {
                            roleId: result.recordset[0].roleID,
                            roleName: result.recordset[0].roleName
                        }
                    }

                    const { error } = User.validate(record);
                    if (error) throw { statusCode: 409, message: error };

                    resolve(new User(record));
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

    // static readByEmail(email)
    static readByEmail(email) {
        return new Promise((resolve, reject) => {
            (async () => {
                // connect to DB
                // query: select * from userLogin where userEmail = email
                // check the result, we should have either 1 or no result
                //  --> if no result: user is not found
                //  --> if more results: corrupt DB
                // create a new userWannabe object and validate (can it be a user?)
                // if all good, resolve with new user based on userWannabe
                // if error, reject with error
                // CLOSE THE CONNECTION TO DB
                try {
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                        .input('userEmail', sql.NVarChar(255), email)
                        .query('SELECT * FROM marvelUserLogin WHERE userEmail = @userEmail');
                    console.log(result);
                    if (result.recordset.length == 0) throw { statusCode: 404, message: 'User not found (email)' };
                    if (result.recordset.length > 1) throw { statusCode: 500, message: 'Database is corrupt.' };

                    const userWannabe = {
                        userId: result.recordset[0].userID,
                        userEmail: result.recordset[0].userEmail
                    }

                    const { error } = User.validate(userWannabe);
                    if (error) throw { statusCode: 409, message: error };

                    resolve(new User(userWannabe));
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

    // create(optionsObj) :: optionsObj {password: '13212j3k2j1', ...}
    // const user = new User(userData);
    // user.create(optionsObj);
    create(optionsObj) {
        return new Promise((resolve, reject) => {
            (async () => {
                //// this will be handled on route-handler level:
                //// check if the user already exists in the DB (static readByEmail)
                ////      --> if exists, then terminate create method, may not add the same user again
                ////      --> if doesnt exist then carry on

                // make hashPassword from optionsObj.password
                // connect to the DB
                // make a query to insert user into userLogin table
                //      insert the hashedPassword into the password table with the user's key :: SCOPE_IDENTITY()
                //      read out the newly created user :: SCOPE_IDENTITY()
                // check the result
                //      --> if it exists and there is no more than 1 result, we are good to continue
                //      --> else throw error
                // create a user object and validate it
                // if all good, resolve with the new user object
                // if error, reject with error
                // CLOSE THE CONNECTION TO DB
                try {
                    const hashedPassword = await bcrypt.hash(optionsObj.password, crypt.saltRounds);

                    const pool = await sql.connect(con);
                    const result1 = await pool.request()
                        .input('userEmail', sql.NVarChar(255), this.userEmail)
                        .input('rawPassword', sql.NVarChar(255), optionsObj.password)
                        .input('hashedPassword', sql.NVarChar(255), hashedPassword)
                        .query(`INSERT INTO marvelUserLogin (userEmail, userPassword) VALUES (@userEmail, @rawPassword);
                                SELECT userID, userEmail FROM marvelUserLogin WHERE userID = SCOPE_IDENTITY();
                                INSERT INTO marvelUserPassword (FK_userID, hashedPassword) VALUES (SCOPE_IDENTITY(), @hashedPassword)`);
                    console.log(result1);
                    if (result1.recordset.length != 1) throw { statusCode: 500, message: 'Database is corrupt.' };

                    const result2 = await pool.request()
                        .input('userID', sql.Int, result1.recordset[0].userID)
                        .query(`INSERT INTO marvelUserLoginRole (FK_userID, FK_roleID)
                                VALUES (@userID, 2);
                                SELECT * FROM marvelUserLoginRole INNER JOIN marvelUserRole
                                ON marvelUserLoginRole.FK_roleID = marvelUserRole.roleID
                                WHERE marvelUserLoginRole.FK_userID = @userID`);
                    console.log(result2);
                    if (result2.recordset.length != 1) throw { statusCode: 500, message: 'Database is corrupt.' };

                    const record = {
                        userId: result1.recordset[0].userID,
                        userEmail: result1.recordset[0].userEmail,
                        role: {
                            roleId: result2.recordset[0].roleID,
                            roleName: result2.recordset[0].roleName
                        }
                    }

                    const { error } = User.validate(record);
                    if (error) throw { statusCode: 409, message: error };

                    resolve(new User(record));
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

}

module.exports = User;