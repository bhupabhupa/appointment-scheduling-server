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

function groupListISO(result, key) {
    let list = [ ...result.sort(compareMeetingDate) ];
	let resObj = {}
	list.map(item => {
	
		if(!((new Date(item[key]).toISOString()) in resObj)) {
			resObj[new Date(item[key]).toISOString()] = []
		}
		resObj[new Date(item[key]).toISOString()].push(item)
	
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
            await meeting.save();
            res.status(201).send({ message : "Success" });
        } catch (error) {
            console.log("ERROR : ", error);
            res.status(400).send(error);
        }
    });

    app.get('/api/v1/meeting/list/:user_id/:dated/:page_no', async (req, res) => {
        try {
            let { user_id, dated, page_no } = req.params;

            let currentDate = new Date()
            let myISODate = currentDate.getFullYear()+"-0"+(currentDate.getMonth()+1)+"-"+(currentDate.getDate()-1)+"T"+"18:30:00.000Z";
            let query = {user_id: user_id}
            if(dated === 'past') {
                query.meetingDate = { $lt: new Date(myISODate) }
            } else {
                query.meetingDate = { $gte: new Date(myISODate) }
            }

            let pageCount = 5;
            let skipRec = parseInt(page_no)*pageCount - pageCount;
            let meetingList = await Meeting.find(query).sort({ meetingDate: 1, meetingTime: 1}).skip(skipRec).limit(pageCount);
            let totalRecords = await Meeting.countDocuments(query);
            let formatedList = groupList(meetingList, 'meetingDate');
            res.status(201).send({ meetingList : formatedList, totalRecords : totalRecords, page_no: page_no });
            //res.status(201).send({ meetingList : {}, totalRecords : 0, page_no: page_no });
        } catch (error) {
            console.log("ERROR : ", error);
            res.status(400).send(error);
        }
    });
    
    app.get('/meeting/list/:user_id/:dated', async (req, res) => {
        try {
            let user_id = req.params.user_id;
            let dated = req.params.dated;
            let currentDate = new Date()
            let myISODate = currentDate.getFullYear()+"-0"+(currentDate.getMonth()+1)+"-"+(currentDate.getDate()-1)+"T"+"18:30:00.000Z";
            let query = {user_id: user_id}
            if(dated === 'past') {
                query.meetingDate = { $lt: new Date(myISODate) }
            } else {
                query.meetingDate = { $gte: new Date(myISODate) }
            }
            let meetingList = await Meeting.find(query);
            let formatedList = groupListISO(meetingList, 'meetingDate');
            res.status(201).send({ meetingList : formatedList });
        } catch (error) {
            console.log("ERROR : ", error);
            res.status(400).send(error);
        }
    });
}

