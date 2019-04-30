
const {generateCommand} = require('./util/command');
const {isRealString} = require('./util/validation');

const Service = require('./service/Service');
let service = new Service(); 

const Context = require('./util/context');

/*---------------------------------------------------------*/

const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
//process.env.PORT is some heroku shit. 3000 if not used.
const port = process.env.PORT || 3000;
let app = express();
var server = http.createServer(app);
var io = socketIO(server); 

app.use(express.static(publicPath));
/*---------------------------------------------------------*/


io.on('connection', (socket) => { 

	let currentContext = null;

	socket.on('registerDevice', (context, setContext) => {
		
		currentContext = JSON.parse(context);

		if (currentContext != null){
			// Client already known 
			console.log("Client (re-)connected with context:\n" + context);
		}else{
			// First connection with this client
			currentContext = new Context(); // Create new Context only with random session id; userId null !
			setContext(JSON.stringify(currentContext));
			console.log("New client connected. Context created:\n" + JSON.stringify(newContext));
		}
	});

	socket.on('disconnect', () => {
		console.log("User disconnected with context:\n" + JSON.stringify(currentContext));
	});

	
	//socket.emit('command', generateCommand(), () => {
	//	console.log("Command approved!");
	//});
});

server.listen(port, () => {
	console.log("Server is up on port " + port);
});