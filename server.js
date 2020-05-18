const express = require('express');
var cors = require('cors');
const PORT = process.env.PORT || 8088;
require('./db/db');

const app = express();
app.use(express.json());
app.use(cors());

require('./routes/user')(app);
require('./routes/event')(app);
require('./routes/meeting')(app);

app.listen(PORT, () => {
	console.log('Server started on :', PORT)
});