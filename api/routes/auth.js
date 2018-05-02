module.exports = (api, Users, _, functions) => {
    api.post('/auth/signup', (req, res) => {

        if (_.isEmpty(req.body)) return functions.jsonResponse(400, 'error', null, res, 'Fields are empty')
        req.checkBody('name', "Name field cannot be empty").notEmpty();
        req.checkBody('password', "Passsword field cannot be empty").notEmpty();
        req.checkBody('email', 'Email cannot be empty').notEmpty()
        req.checkBody('email', 'Email must follow proper convention').isEmail();

        req.getValidationResult()
            .then((result) => {
                if (!result.isEmpty()) {
                    return utils.jsonResponse(400, 'error', null,res, 'Data Validation Failed', result.array())
                }
                Users.findOne({
                    email: req.body.email
                }, (err, user) => {
                    if (err) functions.jsonResponse(500, "error", null, res, 'An Error occured while fetching user', err);
                    if (user) functions.jsonResponse(400, "error", null, res, 'Email Address already exists', err);
                    const user_data = _.pick(req.body, ['name', 'email', 'password']);
                    user_data.password = functions.hasher(req.body.password);
                    const token = functions.encryptPayload(user_data);
                    user_data.token = token;

                    const new_user = new Users(user_data)
                    new_user.save(err => {
                        if (err) functions.jsonResponse(500, 'error', null, res, 'An Error occured while saving user', err);
                        const user_response = _.pick(new_user, ['name','email','token']);
                        functions.jsonResponse(200, 'success', user_response, res, "Sign up successful");
                    })
                })
            })
    })

    api.post('/auth/login', (req, res) => {
        if (_.isEmpty(req.body)) return functions.jsonResponse(400, 'error', null, res, 'Fields are empty')
        req.checkBody('password', "Passsword field cannot be empty").notEmpty();
        req.checkBody('email', 'Email cannot be empty').notEmpty().isEmail();

        req.getValidationResult()
            .then((result) => {
                if (!result.isEmpty()) {
                    return functions.jsonResponse(400, 'error', null,res, 'Data Validation Failed', result.array())
                }
                Users.findOne({
                    email: req.body.email.toLowerCase(),
                }).exec((err, user) => {
                    if (err) functions.jsonResponse(500, 'error', null, "An Error occured while fetching user", result.array())
                    if (user) {
    
                        if (functions.decrypter(req.body.password, user.password)) {
                            const user_response = _.pick(user, ['_id','name','email','token']);
                            return functions.jsonResponse(200, 'success', user_response, res, 'Successfully Logged In');
                        }
                        else return functions.jsonResponse(403, 'error', null, res, 'Incorrect Email/Password combination',err);
                        
                    }
                })
            })
    })

}