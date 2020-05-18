const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');



const eventSchema = new Schema({
    user_id: { type: String, required: true},
    event_name: { type: String, required: true },
    duration: { type: Number, required: true }
});

const Event = mongoose.model('Event', eventSchema)

module.exports = Event;