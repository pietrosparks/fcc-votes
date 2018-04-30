module.exports = (api, Users, Polls, _, functions) => {
    api.post('/polls', (req, res) => {
        if (_.isEmpty(req.body)) return functions.jsonResponse(400, 'error', null, res, 'Fields are empty')
        req.checkBody('name', "Name field cannot be empty").notEmpty();

        req.getValidationResult()
            .then((result) => {
                if (!result.isEmpty()) {
                    return functions.jsonResponse(400, 'error', null.res, 'Data Validation Failed', result.array())
                }
                Users.findById(req.query.user_id).exec((err, user) => {
                    if (err) return functions.jsonResponse(500, 'error', null, res, "An error occured", err);
                    if (!user)(400, 'error', null, res, "No User found", err);
                    const poll_data = _.pick(req.body, ['name', 'user_id']);
                    poll_data.poll_id = functions.random(8);
                    const new_poll = new Polls(poll_data)
                    new_poll.save(err => {
                        if (err) functions.jsonResponse(500, 'error', null, res, "An Error Occured", err);
                        functions.jsonResponse(200, 'success', new_poll, res, "Poll Has Been Created Successfully");
                    })
                })

            })
    })

    api.get('/polls', (req, res) => {
        Polls.find({}).exec((err, poll) => {
            if (err) functions.jsonResponse(500, 'error', null, res, "An Error occured while fetching polls", err);
            if (_.isEmpty(poll)) functions.jsonResponse(404, 'error', null, res, "No polls have been created");
            return functions.jsonResponse(200, 'success', poll, res, "Polls retrieved Sucessfully");
        })
    })

    api.get('/polls/:id', (req, res) => {
        Polls.findOne({
            poll_id: req.params.id
        }).exec((err, poll) => {
            if (err) functions.jsonResponse(500, 'error', null, res, "An Error occured while fetching polls", err);
            if (!poll) functions.jsonResponse(404, 'error', null, res, "Poll doesnt exist", err);
            return functions.jsonResponse(200, 'success', poll, res, "Polls retrieved Sucessfully");
        })
    })

    api.put('/polls/:id', (req, res) => {
        Polls.findOne({
            poll_id: req.params.id,
            user_id: req.query.user_id
        }).exec((err, poll) => {
            if (err) functions.jsonResponse(500, 'error', null, res, "An Error occured while fetching polls", err);
            if (!poll) functions.jsonResponse(404, 'error', null, res, "Poll doesnt exist", err);
            const poll_update = _.pick(req.body, ['name', 'options', 'voters', 'poll_id', 'user_id']);

            poll = Object.assign(poll, poll_update);
            poll.save(err => {
                if (err) functions.jsonResponse(500, 'error', null, res, "An Error occured while saving", err);
                functions.jsonResponse(200, 'success', poll, res, "Poll updated sucessfully");
            })

        })
    })

    api.delete('/polls/:id',(req,res)=>{
        Polls.findOneAndRemove({
            poll_id: req.params.id,
            user_id: req.query.user_id
        }).exec((err)=>{
            if(err) functions.jsonResponse(500, 'error', null, res, "An Error occured while deleting poll", err);
            functions.jsonResponse(200,'success', null, res, "Poll deleted successfully");
        })
    })
}