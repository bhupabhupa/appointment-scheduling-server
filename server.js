const express = require('express');
var cors = require('cors');
const PORT = process.env.PORT || 8088;
require('./db/db');
//const path = require('path');


const app = express();
app.use(express.json());
app.use(cors());

// app.use(express.static(path.join(__dirname, 'build')));


// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

require('./routes/user')(app);
require('./routes/event')(app);
require('./routes/meeting')(app);
const {Tokens} = require("./tokens");

app.all(`/api/v1/*`,Tokens.verifyToken, async (req,res,next)=>{
	next();
});
app.listen(PORT, () => {
	console.log('Server started on :', PORT)
});