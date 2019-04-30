const CommandType = {

	Registration: {
		SHOW_MESSAGE_SUCCESS: "SHOW_MESSAGE_SUCCESS",
		SHOW_LOGIN_SCREEN: "SHOW_LOGIN_SCREEN",
		SHOW_INVALID_INPUT_ERROR_MESSAGE: "SHOW_INVALID_INPUT_ERROR_MESSAGE"
	},
	Login: {

	}

}

let generateCommand = (commandType, params) => {
	return {commandType: commandType,
			params: params,
			timestamp: new Date().getTime()};
}

module.exports = {CommandType, generateCommand};