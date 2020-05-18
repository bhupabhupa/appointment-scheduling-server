const ObjectId = require('mongodb').ObjectID;
const Event = require('../models/Event');

module.exports = app => {
    app.post('/api/v1/event/add', async (req, res) => {
        try {
            const event = new Event(req.body);
            await event.save();
            res.status(201).send({ message : "Success" });
        } catch (error) {
            console.log("ERROR : ", error);
            res.status(400).send(error);
        }
    });

    app.put('/api/v1/event/update', async (req, res) => {
        try {
            const event = {...req.body};
            //console.log(event)
            let result = await Event.updateOne({
                _id: new ObjectId(event._id)
            }, {
                $set: {
                    event_name: event.event_name,
                    duration: event.duration
                }
            });
            res.status(201).send({ message : "Success" });
        } catch (error) {
            console.log("ERROR : ", error);
            res.status(400).send(error);
        }
    });

    app.get('/api/v1/event/list/:id', async (req, res) => {
        try {
            let id = req.params.id;
            const eventList = await Event.find({user_id: id});
            res.status(201).send({ eventList });
        } catch (error) {
            console.log("ERROR : ", error);
            res.status(400).send(error);
        }
    });    
}

