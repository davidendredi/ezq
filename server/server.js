const HashMap = require('hashmap');

const {CommandType, generateCommand} = require('./util/command');
const {isRealString} = require('./util/validation');

const Service = require('./service/Service');

const Context = require('./util/context');
const Exception = require('./util/exception');

/*---Configuration socket.io-------------------------------*/

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
/*---Addressed Messages------------------------------------*/

let socketMap = new HashMap();

let sendCommandToDevice = function(deviceId, command){
	socketMap.get(deviceId).emit('command', command);
}

/*---------------------------------------------------------*/
/*---Controller Implementation-----------------------------*/

let service = new Service();

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
			console.log("New client connected. Context created:\n" + JSON.stringify(currentContext));
		}

		// save/update socket associated with deviceId
		socketMap.set(currentContext.deviceId, socket);
	});

	socket.on('disconnect', () => {
		console.log("User disconnected with context:\n" + JSON.stringify(currentContext));
	});

	
	//socket.emit('command', generateCommand(), () => {
	//	console.log("Command approved!");
	//});

	/*------Login & Register Page------*/

	socket.on('registerOwner', (params, setContext) => {
		try{

			service.registerOwner(params.prename, params.surname, params.email, params.password1, params.password2);

		}catch(exc){
			switch(exc){
				case Exception.Registration.SUCCESS:

					socket.emit('command', generateCommand(CommandType.Registration.SHOW_MESSAGE_SUCCESS, {}), () => {
						//console.log("Command approved!");
					});
					socket.emit('command', generateCommand(CommandType.Registration.SHOW_LOGIN_SCREEN, {}), () => {
						//console.log("Command approved!");
					});

				break;
				case Exception.Registration.failure.INVALID_EMAIL:
					
					socket.emit('command', generateCommand(CommandType.Registration.SHOW_INVALID_INPUT_ERROR_MESSAGE, {message: "Invalid E-Mail."}), () => {
						//console.log("Command approved!");
					});

				break;
				case Exception.Registration.failure.PASSWORDS_NOT_EQUAL:
					
					socket.emit('command', generateCommand(CommandType.Registration.SHOW_INVALID_INPUT_ERROR_MESSAGE, {message: "Passwords are not equal."}), () => {
						//console.log("Command approved!");
					});

				break;
				case Exception.Registration.failure.ALREADY_REGISTERED:
					
					socket.emit('command', generateCommand(CommandType.Registration.SHOW_INVALID_INPUT_ERROR_MESSAGE, {message: "Account with this E-Mail is already registered."}), () => {
						//console.log("Command approved!");
					});

				break;	
			}
			console.log(exc + " with context: " + JSON.stringify(params.context));
		}
	});

	socket.on('loginOwner', (params, setContext) => {
		
	});

	/*------Admin Page--------------*/	

	socket.on('inviteUser', (params, setContext) => {

	});

	socket.on('cancelUser', (params, setContext) => {
		
	});

	socket.on('logoutOwner', (params, setContext) => {
		
	});

});

server.listen(port, () => {
	console.log("Server is up on port " + port);
});