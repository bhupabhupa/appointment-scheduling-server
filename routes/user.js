const ObjectId = require('mongodb').ObjectID;
const User = require('../models/User');
const sendMail = require('../utils/sendMail');
const bcrypt = require('bcryptjs');

module.exports = app => {
    app.get('/', (req, res) => {
        res.status(201).send({ message : 'It works' });
    });

    app.get('/api/v1/user/:user_id', async (req, res) => {
        try {
            let objId = new ObjectId(req.params.user_id);
            console.log(objId)
            let user = await User.findOne({
                _id: new ObjectId(req.params.user_id)
            },{
                password: 0, tokens: 0
            });
            console.log("USER : ", user)
            //let result = await Event.findOne({_id: new ObjectId(event._id)});
            res.status(201).send({ user });
        } catch (error) {
            console.log("ERROR : ", error);
            res.status(400).send(error);
        }
    });

    app.post('/api/v1/user', async (req, res) => {
        try {
            const user = new User(req.body);
            //console.log("USER : ", user);
            await user.save();
            const token = await user.generateAuthToken();
            res.status(201).send({ user, token });
        } catch (error) {
            console.log("ERROR : ", error);
            res.status(400).send(error);
        }
    });

    app.post('/api/v1/user/login', async(req, res) => {
        //Login a registered user
        try {
            const { email, password } = req.body
            const user = await User.findByCredentials(email, password);
            if (!user) {
                return res.status(201).send({error: 'Login failed! Check authentication credentials'});
            }
            const token = await user.generateAuthToken();
            res.send({ user, token });
        } catch (error) {
            res.status(201).send({error: error});
        }
    
    })

    app.get('/api/v1/user/send_mail/:email', async(req, res) => {
        try {
            let toMail = req.params.email;
            let user = await User.findOne({
                email : toMail
            }, {
                password: 0, tokens: 0
            });
            //console.log(user)
            if(user) {
                let res = await sendMail.sendMail(toMail, user._id);
            }
            res.send({ message : 'Done' });
        } catch (error) {
            res.status(201).send({error: error})
        }
    })

    app.put('/api/v1/user/reset_password', async (req, res) => {
        try {
            const user = {...req.body};
            user.password = await bcrypt.hash(user.password, 8);
            console.log(user);

            let result = await User.updateOne({
                email: user.email
            }, {
                $set: {
                    password: user.password
                }
            });
            console.log("RES : ", result);
            res.status(201).send({ user });
        } catch (error) {
            console.log("ERROR : ", error);
            res.status(400).send(error);
        }
    });
}

