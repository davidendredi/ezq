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

let deviceSocketMap = new HashMap();
let deviceUserMap = new HashMap();


let sendCommandToDevice = function (deviceId, command) {
    console.log("Send " + command + " to " + deviceId);
	deviceSocketMap.get(deviceId).emit('command', command);
}

let sendCommandToUser = function(userId, command){
	deviceUserMap.forEach((value, key) => {
		if(value === userId){
			sendCommandToDevice(key, command);
		}
	});
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
		deviceSocketMap.set(currentContext.deviceId, socket);
	});

	socket.on('disconnect', () => {
		console.log("User disconnected with context:\n" + JSON.stringify(currentContext));
	});

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
				default: console.log("Unexpected exception in Registration service.");
			}
			console.log(exc + " with context: " + JSON.stringify(params.context));
		}
	});



	socket.on('loginOwner', (params, setContext) => {
		try{

			let owner = service.loginOwner(params.email, params.password);	
			
			/* Set userId in device context locally */
			let newContext = JSON.parse(params.context);
			newContext.userId = owner.getId();
			setContext(JSON.stringify(newContext));

			/* Add device to device-list of logged in user (owner in this case) */
			deviceUserMap.set(JSON.parse(params.context).deviceId, owner.getId());

            let lobby = service.getOwnerById(owner.getId()).lobby;


            socket.emit('command', generateCommand(CommandType.Screen.SHOW_OWNER_SCREEN, {
                 /* No params */
            }), () => {
                 //console.log("Command approved!");
            });

			console.log(Exception.Login.SUCCESS + "; Context: " + JSON.stringify(newContext));

		}catch(exc){

			switch(exc){
				case Exception.Login.failure.UNKNOWN_EMAIL:

					socket.emit('command', generateCommand(CommandType.Login.SHOW_INVALID_INPUT_ERROR_MESSAGE, {message: "Unknown E-Mail."}), () => {
						//console.log("Command approved!");
					});

				break;
				case Exception.Login.failure.INCORRECT_PASSWORD:

					socket.emit('command', generateCommand(CommandType.Login.SHOW_INVALID_INPUT_ERROR_MESSAGE, {message: "Incorrect Password."}), () => {
						//console.log("Command approved!");
                    });

				break;
				default: console.log("Unexpected exception in Login service.");
			}
			console.log(exc + "; Context: " + JSON.stringify(params.context));
		}
    });

    /*------User Page---------------*/

    socket.on('enqueue', (params, setContext) => {

        socket.emit('test', {});

        let context = JSON.parse(params.context);

        try {

            let owner = service.getOwnerByEnqueueKey(params.enqueueKey);

            if (owner === null) {
                socket.emit('command', generateCommand(CommandType.User.SHOW_INVALID_INPUT_ERROR_MESSAGE, {
                    msg: "Invalid Enqueue Key!"
                }), () => {
                    //console.log("Command approved!");
                });
            }

            let newUserId = service.enqueue(params.enqueueKey, params.name);

            /* Set userId in device context locally */
            let newContext = JSON.parse(params.context);
            newContext.userId = newUserId;
            setContext(JSON.stringify(newContext));

            console.log(Exception.Queue.success.USER_SUCCESSFULLY_ENQUEUED + "; Context: " + JSON.stringify(newContext));

            /* Add device to device-list of logged in user (owner in this case) */
            deviceUserMap.set(JSON.parse(params.context).deviceId, newUserId);

            socket.emit('command', generateCommand(CommandType.User.SHOW_USER_SUCCESSFULLY_ENQUEUED, {
                /* Intentionally left blank */
            }), () => {
                    //console.log("Command approved!");
            });

            /* Notify all Owner devices */
            sendCommandToUser(owner.id, generateCommand(CommandType.Screen.UPDATE_OWNER_SCREEN, {
                queue: owner.lobby.queue, enqueueKey: owner.lobby.enqueueKey, lobbyActive: owner.lobby.active
            }), () => {});

        } catch (exc) {

            switch (exc) {
                case Exception.Queue.failure.INVALID_ENQUEUE_KEY:

                    socket.emit('command', generateCommand(CommandType.User.SHOW_INVALID_INPUT_ERROR_MESSAGE, {
                        msg: "Invalid Enqueue Key!"
                    }), () => {
                        //console.log("Command approved!");
                    });

                    break;
            }
            console.log(exc + "; Context: " + JSON.stringify(params.context));
        }

    });

	/*------Admin Page--------------*/

    socket.on('requestUpdateOwnerScreen', (params, setContext) => {

        let context = JSON.parse(params.context);
        try {
            let owner = service.getOwnerById(context.userId);

            if (owner.lobby === null || owner.lobby.active == false) {
                socket.emit('command', generateCommand(CommandType.Screen.UPDATE_OWNER_SCREEN, {
                    queue: [], enqueueKey: null, lobbyActive: false
                }), () => {
                    //console.log("Command approved!");
                });
            } else {
                socket.emit('command', generateCommand(CommandType.Screen.UPDATE_OWNER_SCREEN, {
                    queue: owner.lobby.queue, enqueueKey: owner.lobby.enqueueKey, lobbyActive: owner.lobby.active
                }), () => {
                    //console.log("Command approved!");
                });
            }

        } catch (exc) {
            switch (exc) {
                case Exception.Internal.unexpected.OWNER_NOT_FOUND:
                    console.log("Owner not found when requesting update for owner screen.");

                    socket.emit('command', generateCommand(CommandType.Screen.SHOW_LOGIN_SCREEN, {
                        /* No params */
                    }), () => {
                        //console.log("Command approved!");
                    });

                    break;
            }
            console.log("DEBUG: " + exc);
        }
    });

    socket.on('openLobby', (params, setContext) => {

        let context = JSON.parse(params.context);

        try {
            service.openLobby(context.userId);
        } catch (exc) {

            let lobby = null;
            try {
                lobby = service.getOwnerById(context.userId).lobby;
            } catch (err) {
                exc + "; Context: " + JSON.stringify(params.context)
            }
            switch (exc) {

                case Exception.Lobby.success.CREATED_NEW_ACTIVE_LOBBY:

                    sendCommandToUser(context.userId, generateCommand(CommandType.Screen.UPDATE_OWNER_SCREEN, {
                        queue: lobby.queue, enqueueKey: lobby.enqueueKey, lobbyActive: lobby.active
                    }));

                    break;
                case Exception.Lobby.success.ACTIVATED_EXISTING_LOBBY:

                    sendCommandToUser(context.userId, generateCommand(CommandType.Screen.UPDATE_OWNER_SCREEN, {
                        queue: lobby.queue, enqueueKey: lobby.enqueueKey, lobbyActive: lobby.active
                    }));

                    break;
                case Exception.Lobby.failure.OWNER_NOT_FOUND_WHILE_OPENING_LOBBY:
                    /* TODO Log out!*/
                    break;
                case Exception.Lobby.failure.MULTIPLE_OWNERS_FOUND_WHILE_OPENING_LOBBY:
                    /* Intentionally left blank */
                    break;
            }
            console.log(exc + "; Context: " + JSON.stringify(params.context));
        }
    });

    socket.on('closeLobby', (params, setContext) => {

        let context = JSON.parse(params.context);

        try {

            let lobby = service.closeLobby(context.userId);

            sendCommandToUser(context.userId, generateCommand(CommandType.Screen.UPDATE_OWNER_SCREEN, {
                queue: lobby.queue, enqueueKey: lobby.enqueueKey, lobbyActive: lobby.active
            }));
            console.log(Exception.Lobby.success.EXISTING_LOBBY_CLOSED + "; Context: " + JSON.stringify(params.context));

        } catch (exc) {
            switch (exc) {
                case Exception.Lobby.failure.OWNER_NOT_FOUND_WHILE_CLOSING_LOBBY:
                    /* TODO Log out!*/
                    break;
                case Exception.Lobby.failure.MULTIPLE_OWNERS_FOUND_WHILE_CLOSING_LOBBY:
                    /* Intentionally left blank */
                    break;
                case Exception.Lobby.failure.TRIED_TO_CLOSE_NOT_EXISTING_LOBBY:
                    /* TODO Log out!*/
                    break;
                case Exception.Lobby.failure.TRIED_TO_CLOSE_IN_STATE_INACTIVE:
                    /* TODO Update*/
                    break;
                
            }
            console.log(exc + "; Context: " + JSON.stringify(params.context));
        }

    });

    socket.on('fetchUser', (params, setContext) => {
        let context = JSON.parse(params.context);
        try {
            service.dequeue(params.targetUserId);
        } catch (exc) {
            switch (exc) {
                case Exception.Queue.success.USER_SUCCESSFULLY_DEQUEUED:
                    /* Notify all Owner devices */
                    sendCommandToUser(context.userId, generateCommand(CommandType.Screen.UPDATE_OWNER_SCREEN, {
                        queue: service.getOwnerById(context.userId).lobby.queue,
                        enqueueKey: service.getOwnerById(context.userId).lobby.enqueueKey,
                        lobbyActive: service.getOwnerById(context.userId).lobby.active
                    }), () => {});

                    // Notify user
                    sendCommandToUser(params.targetUserId, generateCommand(CommandType.Demo.FETCH_USER, {
                        txt: params.txt
                    }));

                    break;
                case Exception.Queue.failure.USER_NOT_FOUND_IN_QUEUE:

                    break;
                case Exception.Internal.unexpected.OWNER_NOT_FOUND:
                    break;
            }
            console.log(exc + "; Context: " + JSON.stringify(params.context));
        }
	});

	socket.on('cancelUser', (params, setContext) => {
        let context = JSON.parse(params.context);
        try {
            service.dequeue(params.targetUserId);
        } catch (exc) {
            switch (exc) {
                case Exception.Queue.success.USER_SUCCESSFULLY_DEQUEUED:
                    /* Notify all Owner devices */
                    sendCommandToUser(context.userId, generateCommand(CommandType.Screen.UPDATE_OWNER_SCREEN, {
                        queue: service.getOwnerById(context.userId).lobby.queue,
                        enqueueKey: service.getOwnerById(context.userId).lobby.enqueueKey,
                        lobbyActive: service.getOwnerById(context.userId).lobby.active
                    }), () => { });

                    // Notify user
                    sendCommandToUser(params.targetUserId, generateCommand(CommandType.Demo.CANCEL_USER, {
                        txt: params.txt
                    }));

                    break;
                case Exception.Queue.failure.USER_NOT_FOUND_IN_QUEUE:

                    break;
                case Exception.Internal.unexpected.OWNER_NOT_FOUND:
                    break;
            }
            console.log(exc + "; Context: " + JSON.stringify(params.context));
        }
	});

	socket.on('logoutOwner', (params, setContext) => {
		
	});

	socket.on('sendTo', (params, setContext) => {
		sendCommandToUser(params.to, generateCommand(CommandType.Demo.MESSAGE, {txt: params.txt}));
	});

});

server.listen(port, () => {
	console.log("Server is up on port " + port);
});