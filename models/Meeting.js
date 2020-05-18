const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');



const meetingSchema = new Schema({
    user_id: { type: String, required: true},
    event_id: { type: String, required: true},
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true},
    event_name: { type: String, required: true },
    duration: {type: String, required: true },
    meetingDate: { type: Date, default: Date.now() },
    meetingTime: { type: String, required: true }
});

const Meeting = mongoose.model('Meeting', meetingSchema)

module.exports = Meeting;