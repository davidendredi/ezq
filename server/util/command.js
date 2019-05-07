const CommandType = {

	Demo: {
        MESSAGE: "MESSAGE",
        FETCH_USER: "FETCH_USER",
        CANCEL_USER: "CANCEL_USER"
	},
	Registration: {
		SHOW_MESSAGE_SUCCESS: "SHOW_MESSAGE_SUCCESS",
		SHOW_LOGIN_SCREEN: "SHOW_LOGIN_SCREEN",
		SHOW_INVALID_INPUT_ERROR_MESSAGE: "SHOW_INVALID_INPUT_ERROR_MESSAGE"
	},
	Screen: {
        SHOW_OWNER_SCREEN: "SHOW_OWNER_SCREEN",
        UPDATE_OWNER_SCREEN: "UPDATE_OWNER_SCREEN",
        SHOW_LOGIN_SCREEN: "SHOW_LOGIN_SCREEN"
    },
    Login: {
        SHOW_INVALID_INPUT_ERROR_MESSAGE: "SHOW_INVALID_INPUT_ERROR_MESSAGE"
    },
    User: {
        ENQUEUE__SHOW_INVALID_INPUT_ERROR_MESSAGE: "ENQUEUE__SHOW_INVALID_INPUT_ERROR_MESSAGE",
        SHOW_USER_SUCCESSFULLY_ENQUEUED: "SHOW_USER_SUCCESSFULLY_ENQUEUED",
    }

}

let generateCommand = (commandType, params) => {
	return {commandType: commandType,
			params: params,
			timestamp: new Date().getTime()};
}

module.exports = {CommandType, generateCommand};