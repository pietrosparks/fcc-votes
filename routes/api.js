const functions = require('../utils');
const _ = require('lodash');
const JWT = require('jsonwebtoken');
const secret = require('../dbconfig/secrets');
const Users = require('../models/users');
const Polls = require('../models/polls');



module.exports = (express) => {

    const api = express.Router();

    require('./auth')(api, Users, _, functions);
    require('./poll')(api, Users,Polls, _, functions)

    return api;
}