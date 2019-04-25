const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateCommand} = require('./util/command');
const {isRealString} = require('./util/validation');

const UserService = require('./service/UserService');
let userService = new UserService(); 

const publicPath = path.join(__dirname, '../public');
//process.env.PORT is some heroku shit. 3000 if not used.
const port = process.env.PORT || 3000;
let app = express();
var server = http.createServer(app);
var io = socketIO(server); 

app.use(express.static(publicPath));


io.on('connection', (socket) => {

	let user = null;

	console.log("New client connected");

	socket.on('registerDevice', (uid, setUid) => {

		if (userService.existsUid(uid)){
			user = userService.getUserByUid(uid);
			console.log("User recognized with uid " + uid);
			user.connected = true;	
		}else{
			user = userService.createAndAddUser();
			setUid(user.uid);
			console.log("User unknown. Create new one with uid " + user.uid);
		}
	});

	socket.on('disconnect', () => {
		
		user.connected = false;
		setTimeout(() => {
			if(!user.connected){
				console.log("User " + user.uid + " GONE");
			}else{
				//console.log("Timeout ready.");
			}
		}, 10000);
		console.log('User ' + user.uid + ' disconnected; waiting for reconnection...');
	});

	
	//socket.emit('command', generateCommand(), () => {
	//	console.log("Command approved!");
	//});
});

server.listen(port, () => {
	console.log("Server is up on port " + port);
});