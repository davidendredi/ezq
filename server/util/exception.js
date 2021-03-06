const Internal = {
    unexpected: {
        MULTIPLE_OWNERS_WITH_SAME_EMAIL_FOUND: "MULTIPLE_OWNERS_WITH_SAME_EMAIL_FOUND",
        OWNER_NOT_FOUND: "OWNER_NOT_FOUND",
        MULTIPLE_OWNERS_FOUND: "MULTIPLE_OWNERS_FOUND",
        LOBBY_NOT_FOUND_FOR_ENQUEUE_KEY: "LOBBY_NOT_FOUND_FOR_ENQUEUE_KEY",
        FOUND_LOBBY_ID_FOR_ENQUEUE_KEY_BUT_NO_LOBBY: "FOUND_LOBBY_ID_FOR_ENQUEUE_KEY_BUT_NO_LOBBY",
        MULTIPLE_USERS_WITH_SAME_ID_FOUND_IN_QUEUE: "MULTIPLE_USERS_WITH_SAME_ID_FOUND_IN_QUEUE"
    }
}

const Registration = {
	failure: {
		INVALID_EMAIL: "INVALID_EMAIL",
		PASSWORDS_NOT_EQUAL: "PASSWORDS_NOT_EQUAL",
		ALREADY_REGISTERED: "ALREADY_REGISTERED",

	}, SUCCESS: "REGISTRATION_SUCCESS"
}

const Login = {
	failure: {
		UNKNOWN_EMAIL: "UNKNOWN_EMAIL",
		INCORRECT_PASSWORD: "INCORRECT_PASSWORD",
	}, SUCCESS: "LOGIN_SUCCESS"
}

const Lobby = {

    failure: {
        OWNER_NOT_FOUND_WHILE_OPENING_LOBBY: "OWNER_NOT_FOUND_WHILE_OPENING_LOBBY", 
        MULTIPLE_OWNERS_FOUND_WHILE_OPENING_LOBBY: "MULTIPLE_OWNERS_FOUND_WHILE_OPENING_LOBBY",
        OWNER_NOT_FOUND_WHILE_CLOSING_LOBBY: "OWNER_NOT_FOUND_WHILE_CLOSING_LOBBY",
        MULTIPLE_OWNERS_FOUND_WHILE_CLOSING_LOBBY: "MULTIPLE_OWNERS_FOUND_WHILE_CLOSING_LOBBY",
        TRIED_TO_ACTIVATE_IN_STATE_ACTIVE: "TRIED_TO_ACTIVATE_IN_STATE_ACTIVE",
        TRIED_TO_CLOSE_IN_STATE_INACTIVE: "TRIED_TO_CLOSE_IN_STATE_INACTIVE",
        TRIED_TO_CLOSE_NOT_EXISTING_LOBBY: "TRIED_TO_CLOSE_NOT_EXISTING_LOBBY"
    },
    success: {
        ACTIVATED_EXISTING_LOBBY: "ACTIVATED_EXISTING_LOBBY",
        CREATED_NEW_ACTIVE_LOBBY: "CREATED_NEW_ACTIVE_LOBBY",
        EXISTING_LOBBY_CLOSED: "EXISTING_LOBBY_CLOSED"
    }
}

const Queue = {
    failure: {
        INVALID_ENQUEUE_KEY: "INVALID_ENQUEUE_KEY",
        USER_NOT_FOUND_IN_QUEUE: "USER_NOT_FOUND_IN_QUEUE"
    },
    success: {
        USER_SUCCESSFULLY_ENQUEUED: "USER_SUCCESSFULLY_ENQUEUED",
        USER_SUCCESSFULLY_DEQUEUED: "USER_SUCCESSFULLY_DEQUEUED"
    }
}

module.exports = {Internal, Registration, Login, Lobby, Queue};