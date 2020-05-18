const ObjectId = require('mongodb').ObjectID;
const Meeting = require('../models/Meeting');

function compareMeetingDate(a, b) {
    const bandA = new Date(a.meetingDate);
    const bandB = new Date(b.meetingDate);
  
    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison;
  }

function groupList(result, key) {
    let list = [ ...result.sort(compareMeetingDate) ];
	let resObj = {}
	list.map(item => {
	
		if(!(item[key] in resObj)) {
			resObj[item[key]] = []
		}
		resObj[item[key]].push(item)
	
	})

	return resObj
}

module.exports = app => {
    app.post('/api/v1/meeting/add', async (req, res) => {
        try {
            // let meeting = {
            //     first_name: req.body.first_name,
            //     last_name: req.body.last_name,
            //     email: req.body.email,
            //     meetingDate: new Date(req.body.meetingDate),
            //     meetingTime: req.body.meetingTime,
            //     event_id: req.body.event_id,
            //     user_id: req.body.user_id
            // }
            let meeting = new Meeting(req.body);
            //console.log("meeting : ",meeting.meetingDate, new Date(meeting.meetingDate).toISOString());
            //meeting.meetingDate = new Date();
            //delete meeting.meetingDate
            //console.log("meeting : ",meeting.meetingDate);
            await meeting.save();
            res.status(201).send({ message : "Success" });
        } catch (error) {
            console.log("ERROR : ", error);
            res.status(400).send(error);
        }
    });

    app.get('/api/v1/meeting/list/:user_id/:dated', async (req, res) => {
        try {
            let user_id = req.params.user_id;
            let dated = req.params.dated;
            
            // if(dated === 'past') {
            //     query.meetingDate = $lt { Date.now() }
            // }
            //console.log(new Date())
            let currentDate = new Date()
            console.log(currentDate)
            //currentDateSplit = currentDate.split('T')
            let myISODate = currentDate.getFullYear()+"-0"+(currentDate.getMonth()+1)+"-"+(currentDate.getDate()-1)+"T"+"18:30:00.000Z";
            console.log(myISODate)
            let query = {user_id: user_id}
            if(dated === 'past') {
                query.meetingDate = { $lt: new Date(myISODate) }
            } else {
                query.meetingDate = { $gte: new Date(myISODate) }
            }
            let meetingList = await Meeting.find(query);
            //console.log("meetingList : ",meetingList)
            let formatedList = groupList(meetingList, 'meetingDate')
            //console.log("formatedList : ",formatedList)
            res.status(201).send({ meetingList : formatedList });
        } catch (error) {
            console.log("ERROR : ", error);
            res.status(400).send(error);
        }
    });    
}

