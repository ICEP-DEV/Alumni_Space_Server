//imports
const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const connection = require('./database/database')

const app = express();

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('uploads'));

app.use('/api', require('./routes/event'))
app.use('/api', require('./routes/alumni'))


const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});