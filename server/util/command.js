const CommandType = {

	Demo: {
		MESSAGE: "MESSAGE"
	},
	Registration: {
		SHOW_MESSAGE_SUCCESS: "SHOW_MESSAGE_SUCCESS",
		SHOW_LOGIN_SCREEN: "SHOW_LOGIN_SCREEN",
		SHOW_INVALID_INPUT_ERROR_MESSAGE: "SHOW_INVALID_INPUT_ERROR_MESSAGE"
	},
	Screen: {
        SHOW_ACTIVE_ADMIN_SCREEN: "SHOW_ACTIVE_ADMIN_SCREEN",
        SHOW_INACTIVE_ADMIN_SCREEN: "SHOW_INACTIVE_ADMIN_SCREEN"
    },
    Login: {
        SHOW_INVALID_INPUT_ERROR_MESSAGE: "SHOW_INVALID_INPUT_ERROR_MESSAGE"
    }

}

let generateCommand = (commandType, params) => {
	return {commandType: commandType,
			params: params,
			timestamp: new Date().getTime()};
}

module.exports = {CommandType, generateCommand};