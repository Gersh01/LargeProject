const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

const path = require('path');
const { log } = require('console');
const PORT = process.env.PORT || 4000;

const app = express();

app.set('port', (process.env.PORT || 4000));

app.use(cors());
app.use(bodyParser.json());

app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});

require('dotenv').config();
const url = process.env.MONGODB_URI;
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url);
client.connect;

//--------------------API--------------------

//users API
var usersApi = require('./api/users.js');
usersApi.setApp( app, client );

//projectData API
var projectDataApi = require('./api/project_data.js');
projectDataApi.setApp( app, client );

//teamMembers API
var teamMembersApi = require('./api/team_members.js');
teamMembersApi.setApp( app, client );



if(process.env.NODE_ENV === 'production') {
    app.use(express.static('frontend/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
})

