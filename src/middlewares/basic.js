'use strict'

//create the basic authentication  middleware 
require('dotenv').config();
const SECRET = process.env.SECRET || 'my secret';

const base64 = require('base-64');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { usermodel } = require('../models/index')

const basic = async (req, res, next) => {
    try {
        // Get the username and password from the Basic Authentication headers to check user authentication
        if (req.headers.authorization) {
            let basicParts = req.headers.authorization.split(' ')
            let encodedPart = basicParts.pop();
            let decodedPart = base64.decode(encodedPart);
            console.log('decoded', decodedPart);
            let [username, password] = decodedPart.split(':');

            let User = await usermodel.findOne({ where: { username: username } });
            let pwd = await bcrypt.compare(password, User.password);
            if (pwd) {
                let userToken = JWT.sign({}.SECRET, { expiresIn: '365d' })// token generation 
                User.token = userToken;//storing the token for the user
                req.User = User;
                next();
            } else {
                res.status(403).send('invalid login password');
            }
        }
    } catch (error) {
        res.status(403).send('invalid login username');
    }
}



module.exports = basic;