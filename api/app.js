const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const morgan = require('morgan')
const cors = require('cors');
const routerUser = require('./routes/user');
const routerMessages = require('./routes/messages');
const routerChat = require('./routes/chat');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(__dirname + '/log/access.log',{flags: 'a'});

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}))

app.use('/user', routerUser);
app.use('/messages', routerMessages);
app.use('/chat', routerChat);

const port = 4170;

app.listen(port, () => console.debug('Server is listening on port ' + port));
