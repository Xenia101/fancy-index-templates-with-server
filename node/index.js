const express = require("express");
const http = require('http');
const cors = require('cors');

const app = express();

// CORS
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));
//app.use(express.static("public"));
//app.engine('html', require('ejs').renderFile);

const viewRouter   = require('./routes/view');
const uploadRouter = require('./routes/upload');
const deleteRouter = require('./routes/delete');
const renameRouter = require('./routes/rename');

app.use('/view',   viewRouter);
app.use('/upload', uploadRouter);
app.use('/delete', deleteRouter);
app.use('/rename', renameRouter);

server = require('http').createServer(app);

server.listen(3000, '10.0.17.231', function(err) {
    console.log(`Server : ${server.address()['address']}:${server.address()['port']}`);
});