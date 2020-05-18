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
            let user = await User.findOne({
                _id: new ObjectId(req.params.user_id)
            },{
                password: 0
            });
            res.status(201).send({ user });
        } catch (error) {
            console.log("ERROR : ", error);
            res.status(400).send(error);
        }
    });

    app.post('/api/v1/user', async (req, res) => {
        try {
            const user = new User(req.body);
            await user.save();
            res.status(201).send({ user });
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
                password: 0
            });
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
            
            let result = await User.updateOne({
                email: user.email
            }, {
                $set: {
                    password: user.password
                }
            });
            res.status(201).send({ user });
        } catch (error) {
            console.log("ERROR : ", error);
            res.status(400).send(error);
        }
    });
}

