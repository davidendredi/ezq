var validator = require('validator');
const Exception = require('./../util/exception');
const { generateNewKeyFor, freeKeyFor, getItemByKey } = require('./../util/uniqueKeyGenerator');

class User{
	constructor(name){
		this.name = name;
		this.id = "User_" + new Date().getTime(); 
	}

	getId(){
		return this.id;
	}
}

class Owner{
	constructor(firstname, surname, email, password){
		this.firstname = firstname;
		this.surname = surname;
		this.email = email;
		this.password = password;
		this.id = "Owner_" + new Date().getTime();
        this.salt = Math.random();
        this.lobby = null;
	}

	getId(){
		return this.id;
	}
}

class Lobby{
	constructor(){
        this.id = "Lobby_" + new Date().getTime();
		this.active = false;
        this.queue = [];
        this.enqueueKey = null;
	}
}

class Service{
	constructor(){
		this.owners = [];
    }

    getOwnerByEnqueueKey(eKey) {
        let out = null;
        let lobbyId = getItemByKey(eKey);
        this.owners.forEach(ow => {
            if (ow.lobby.id === lobbyId) {
                out = ow;
            }
        });
        return out;
    }

    getLobbyOfOwner(ownerId) {
        let foundOwner = this.owners.filter(ow => ow.id === ownerId);

        if (foundOwner.length === 0) {
            throw Exception.Internal.unexpected.OWNER_NOT_FOUND;
        }

        if (foundOwner.length != 1) {
            throw Exception.Internal.unexpected.MULTIPLE_OWNERS_FOUND;
        }

        foundOwner = foundOwner.pop();

        return foundOwner.lobby;
    }


	
	registerOwner(firstname, surname, email, password1, password2){
		if(!validator.isEmail(email)){
			throw Exception.Registration.failure.INVALID_EMAIL;
		}
		if(!(password1 === password2)){
			throw Exception.Registration.failure.PASSWORDS_NOT_EQUAL;
		}
		if(this.owners.filter(ow => ow.email === email).length != 0){
			throw Exception.Registration.failure.ALREADY_REGISTERED;
		}
		let newOwner = new Owner(firstname, surname, email, password1);
		this.owners.push(newOwner);
		throw Exception.Registration.SUCCESS;
	}

	loginOwner(email, password){

		let foundOwners = this.owners.filter(ow => ow.email === email);

		if(foundOwners.length == 0){
			throw Exception.Login.failure.UNKNOWN_EMAIL;
		}

        if (foundOwners.length > 1) {
            throw Exception.Internal.unexpected.MULTIPLE_OWNERS_WITH_SAME_EMAIL_FOUND;
		}

		let owner = foundOwners.pop();

		if(password != owner.password){
			throw Exception.Login.failure.INCORRECT_PASSWORD;
		}

		/* !!! TODO ONLINE-Flag Handling !!! */

		return owner;
		//throw Exception.Login.SUCCESS;
    }

    openLobby(ownerId) {
        let foundOwner = this.owners.filter(ow => ow.id === ownerId);

        if (foundOwner.length === 0) {
            throw Exception.Lobby.failure.OWNER_NOT_FOUND_WHILE_OPENING_LOBBY;
        }

        if (foundOwner.length != 1) {
            throw Exception.Lobby.failure.MULTIPLE_OWNERS_FOUND_WHILE_OPENING_LOBBY;
        }

        foundOwner = foundOwner.pop();
        let foundLobby = foundOwner.lobby; 

        if (foundLobby === null) {
            // No Lobby for this Owner yet.
            let newLobby = new Lobby();
            newLobby.enqueueKey = generateNewKeyFor(newLobby.id);
            newLobby.active = true;

            foundOwner.lobby = newLobby;

            throw Exception.Lobby.success.CREATED_NEW_ACTIVE_LOBBY;

        } else {
            // Lobby already existing
            if (foundLobby.active) {
                throw Exception.Lobby.failure.TRIED_TO_ACTIVATE_IN_STATE_ACTIVE;
            }
            // Activate existing lobby now...
            foundLobby.enqueueKey = generateNewKeyFor(foundLobby.id);
            foundLobby.active = true;

            throw Exception.Lobby.success.ACTIVATED_EXISTING_LOBBY;
        }
    }

    closeLobby(ownerId) {

        let foundOwner = this.owners.filter(ow => ow.id === ownerId);

        if (foundOwner.length === 0) {
            throw Exception.Lobby.failure.OWNER_NOT_FOUND_WHILE_CLOSING_LOBBY;
        }

        if (foundOwner.length != 1) {
            throw Exception.Lobby.failure.MULTIPLE_OWNERS_FOUND_WHILE_CLOSING_LOBBY;
        }

        foundOwner = foundOwner.pop();
        let foundLobby = foundOwner.lobby; 

        if (foundLobby === null) {
            throw Exception.Lobby.failure.TRIED_TO_CLOSE_NOT_EXISTING_LOBBY;
        } else {
            if (foundLobby.active === false) {
                throw Exception.Lobby.failure.TRIED_TO_CLOSE_IN_STATE_INACTIVE;
            }

            freeKeyFor(foundLobby.id);
            foundLobby.active = false;

            throw Exception.Lobby.success.EXISTING_LOBBY_CLOSED;
        }
    }

    enqueue(enqueueKey, name) {

        let lobbyId = null;

        try {
            lobbyId = getItemByKey(enqueueKey);
        } catch (exc) {
            switch (exc) {
                case Exception.Internal.unexpected.LOBBY_NOT_FOUND_FOR_ENQUEUE_KEY:
                    throw Exception.Queue.failure.INVALID_ENQUEUE_KEY;
                    break;
                default:
                    throw exc;
            }
        }

        let foundLobby = null;

        this.owners.forEach((ow) => {
            if (ow.lobby != null && ow.lobby.id === lobbyId) {
                foundLobby = ow.lobby;
            }
        });

        if (foundLobby === null) { // Unexpected !!!
            throw Exception.Internal.unexpected.FOUND_LOBBY_ID_FOR_ENQUEUE_KEY_BUT_NO_LOBBY;
        }

        let newUser = new User(name);
        foundLobby.queue.push(newUser);

        // Set new enqueue key
        foundLobby.enqueueKey = generateNewKeyFor(foundLobby.id);

        return newUser.id;
    }


}

module.exports = Service;