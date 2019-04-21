const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateCommand} = require('./util/command');

const publicPath = path.join(__dirname, '../public');
const port = 3000;
let app = express();
var server = http.createServer(app);
var io = socketIO(server); 

app.use(express.static(publicPath));





io.on('connection', (socket) => {
	console.log("New client connected");
	socket.on('disconnect', () => {
		console.log('Client disconnected.');
	});

	
	socket.emit('command', generateCommand(), () => {
		console.log("Command approved!");
	});
});

server.listen(port, () => {
	console.log("Server is up on port " + port);
});